#!/bin/bash

# Configurações hardcode para Morph Holesky Testnet
MORPH_PRIVATE_KEY=a4a3d3d4f1f7b1358d903f3608edb0c28d107ea4a8ebadd314d039150d69a23e
MORPH_RPC_URL=https://rpc-quicknode-holesky.morphl2.io
CHAIN_ID=2810

echo "Deploying to Morph Holesky Testnet..."
echo "RPC URL: $MORPH_RPC_URL"
echo "Chain ID: $CHAIN_ID"

forge script script/Deploy.s.sol:DeployScript \
    --private-key $MORPH_PRIVATE_KEY \
    --rpc-url $MORPH_RPC_URL \
    --chain-id $CHAIN_ID \
    --broadcast \
    --verify
