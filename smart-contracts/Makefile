deploy_dry:
	forge script script/Deploy.s.sol -vvvv --rpc-url flow --verify --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url mantle --verify --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url scroll --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url base --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url polygon --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url zircuit --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url morph --verify --verifier=blockscout

deploy_test_dry:
	forge script script/Deploy.s.sol -vvvv --rpc-url flow_test --verify --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url mantle_sepolia --verify --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url scroll_sepolia --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url base_sepolia --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url polygon_amoy --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url zircuit_test --verify
	forge script script/Deploy.s.sol -vvvv --rpc-url morph_test --verify --verifier=blockscout

deploy:
	forge script script/Deploy.s.sol -vvvv --rpc-url flow --verify --broadcast --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url mantle --verify --broadcast --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url scroll --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url base --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url polygon --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url zircuit --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url morph --verify --broadcast --verifier=blockscout

deploy_test:
	forge script script/Deploy.s.sol -vvvv --rpc-url flow_test --verify --broadcast --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url mantle_sepolia --verify --broadcast --verifier=blockscout
	forge script script/Deploy.s.sol -vvvv --rpc-url scroll_sepolia --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url base_sepolia --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url polygon_amoy --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url zircuit_test --verify --broadcast
	forge script script/Deploy.s.sol -vvvv --rpc-url morph_test --verify --broadcast --verifier=blockscout
