//
//  nfc_test.swift
//  Leap Pay
//
//  Created by Owen Murovec on 2024-11-15.
//

import Foundation
import CoreNFC
import PassKit

// Shared protocol for message structure
struct SigningMessage: Codable {
    enum MessageType: String, Codable {
        case request
        case response
    }
    
    let type: MessageType
    let data: Data
    let signature: Data?
}

// Device A (Signer) - The phone that will sign the message
class SignerDevice: NSObject, NFCTagReaderSessionDelegate {
    private var session: NFCTagReaderSession?
    
    func startListening() {
        guard NFCTagReaderSession.readingAvailable else {
            print("NFC not available")
            return
        }
        
        session = NFCTagReaderSession(pollingOption: .iso14443, delegate: self)
        session?.alertMessage = "Ready to receive signing request"
        session?.begin()
    }
    
    // Sign data using Secure Element
    func getSecureElementPass() -> PKSecureElementPass? {
        let library = PKPassLibrary()
        let passes = library.passes(of: PKPassType.secureElement)
        return passes.first as? PKSecureElementPass
    }

    
    // NFCTagReaderSessionDelegate methods
    func tagReaderSessionDidBecomeActive(_ session: NFCTagReaderSession) {
        print("NFC session active - waiting for requester device")
    }
    
    func tagReaderSession(_ session: NFCTagReaderSession, didInvalidateWithError error: Error) {
        print("Session invalidated: \(error.localizedDescription)")
    }
    
    func tagReaderSession(_ session: NFCTagReaderSession, didDetect tags: [NFCTag]) {
        guard let firstTag = tags.first,
              case let .iso7816(nfcTag) = firstTag else {
            session.invalidate(errorMessage: "Invalid tag type")
            return
        }
        
        // Connect to the requester device
        session.connect(to: firstTag) { error in
            guard error == nil else {
                session.invalidate(errorMessage: "Connection failed")
                return≥
            }
            
            // Read the signing request
            let readCommand = NFCISO7816APDU(instructionClass: 0x00,
                                             instructionCode: 0xB0,
                                             p1Parameter: 0x00,
                                             p2Parameter: 0x00,
                                           data: Data(),
                                           expectedResponseLength: 256)
            
            nfcTag.sendCommand(apdu: readCommand) { responseData, sw1, sw2, error in
                guard error == nil,
                      let request = try? JSONDecoder().decode(SigningMessage.self, from: responseData),
                      request.type == .request else {
                    session.invalidate(errorMessage: "Invalid request")
                    return
                }
                
                // Sign the data
                do {
                    
                    // Create response message
                    let response = SigningMessage(type: .response,
                                               data: request.data,
                                               signature: Data())
                    
                    let responseBytes = try JSONEncoder().encode(response)
                    
                    // Send back the signed data
                    let writeCommand = NFCISO7816APDU(instructionClass: 0x00,
                                                      instructionCode: 0xD0,
                                                      p1Parameter: 0x00,
                                                      p2Parameter: 0x00,
                                                    data: responseBytes,
                                                    expectedResponseLength: 0)
                    
                    nfcTag.sendCommand(apdu: writeCommand) { _, _, _, error in
                        if let error = error {
                            session.invalidate(errorMessage: "Failed to send response: \(error.localizedDescription)")
                        } else {
                            session.invalidate(errorMessage: "Successfully signed and sent data")
                        }
                    }
                } catch {
                    session.invalidate(errorMessage: "Signing failed: \(error.localizedDescription)")
                }
            }
        }
    }
}

// Device B (Requester) - The phone that needs data signed
class RequesterDevice: NSObject, NFCNDEFReaderSessionDelegate {
    private var session: NFCNDEFReaderSession?
    private var dataToSign: Data
    private var completion: ((Data?) -> Void)?
    
    init(dataToSign: Data) {
        self.dataToSign = dataToSign
        super.init()
    }
    
    func requestSignature(completion: @escaping (Data?) -> Void) {
        self.completion = completion
        
        session = NFCNDEFReaderSession(delegate: self,
                                      queue: DispatchQueue.main,
                                      invalidateAfterFirstRead: false)
        session?.begin()
    }
    
    // NFCNDEFReaderSessionDelegate methods
    func readerSession(_ session: NFCNDEFReaderSession, didInvalidateWithError error: Error) {
        completion?(nil)
    }
    
    func readerSession(_ session: NFCNDEFReaderSession, didDetectNDEFs messages: [NFCNDEFMessage]) {
        // Implementation for handling NDEF messages if needed
    }
    
    func readerSessionDidBecomeActive(_ session: NFCNDEFReaderSession) {
        // Create signing request message
        let request = SigningMessage(type: .request,
                                   data: dataToSign,
                                   signature: nil)
        
        guard let requestData = try? JSONEncoder().encode(request) else {
            session.invalidate(errorMessage: "Failed to encode request")
            return
        }
        
        // Send request to signer device
        // Note: This is a simplified example - you'd need to implement the actual
        // NDEF message construction and handling
        let message = NFCNDEFMessage(records: [
            NFCNDEFPayload(format: .unknown,
                          type: "application/signing-request".data(using: .utf8)!,
                          identifier: Data(),
                          payload: requestData)
        ])
        
        // Handle response from signer device
        // Implementation would need to parse the response and extract signature
    }
}

// Example usage
class ExampleViewController: UIViewController {
    let signer = SignerDevice()
    
    func startSigningDevice() {
        // Phone A: Start listening for signing requests
        signer.startListening()
    }
    
    func requestSignature() {
        // Phone B: Request signature for some data
        let dataToSign = "Hello, World!".data(using: .utf8)!
        let requester = RequesterDevice(dataToSign: dataToSign)
        
        requester.requestSignature { signature in
            if let signature = signature {
                print("Received signature: \(signature.base64EncodedString())")
            } else {
                print("Failed to get signature")
            }
        }
    }
}

