//
//  MerchantViewController.swift
//  LeapPay
//
//  Created by Simone D'Amico on 16/11/2024.
//

import UIKit

class MerchantViewController : UIViewController {
    let signer = SignerDevice()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        signer.startListening()
    }
    
    @IBAction
    func dismiss() {
        self.dismiss(animated: true);
    }
    
}
