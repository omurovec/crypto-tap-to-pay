deploy_dry:
	forge script script/DeployFactory.s.sol -vvvv --rpc-url flow --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url mantle --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url scroll
	forge script script/DeployFactory.s.sol -vvvv --rpc-url base
	forge script script/DeployFactory.s.sol -vvvv --rpc-url polygon
	forge script script/DeployFactory.s.sol -vvvv --rpc-url zircuit
	forge script script/DeployFactory.s.sol -vvvv --rpc-url morph --verifier=blockscout

deploy_test_dry:
	forge script script/DeployFactory.s.sol -vvvv --rpc-url flow_test --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url mantle_sepolia --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url scroll_sepolia
	forge script script/DeployFactory.s.sol -vvvv --rpc-url base_sepolia
	forge script script/DeployFactory.s.sol -vvvv --rpc-url polygon_amoy
	forge script script/DeployFactory.s.sol -vvvv --rpc-url zircuit_test
	forge script script/DeployFactory.s.sol -vvvv --rpc-url morph_test --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url bitkub_test --verifier=blockscout --legacy

deploy:
	forge script script/DeployFactory.s.sol -vvvv --rpc-url flow --verify --broadcast --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url mantle --verify --broadcast --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url scroll --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url base --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url polygon --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url zircuit --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url morph --verify --broadcast --verifier=blockscout

deploy_test:
	forge script script/DeployFactory.s.sol -vvvv --rpc-url flow_test --verify --broadcast --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url mantle_sepolia --verify --broadcast --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url scroll_sepolia --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url base_sepolia --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url polygon_amoy --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url zircuit_test --verify --broadcast
	forge script script/DeployFactory.s.sol -vvvv --rpc-url morph_test --verify --broadcast --verifier=blockscout
	forge script script/DeployFactory.s.sol -vvvv --rpc-url bitkub_test --verify --broadcast --verifier=blockscout --legacy
