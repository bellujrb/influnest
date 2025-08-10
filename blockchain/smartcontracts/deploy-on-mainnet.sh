source .env

forge script scripts/deploy.mainnet.s.sol:Polygon \
    --private-key $MORPH_MAINNET_PRIVATE_KEY \
    --rpc-url $MORPH_MAINNET_RPC_URL \
    --broadcast
