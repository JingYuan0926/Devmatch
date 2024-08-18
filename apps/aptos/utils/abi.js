export const ABI  = {
        "address": "0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98",
        "name": "faucet1",
        "friends": [],
        "exposed_functions": [
        {
            "name": "add_funds",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
            "&signer",
            "u64"
            ],
            "return": []
        },
        {
            "name": "claim",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
            "&signer",
            "u64"
            ],
            "return": []
        },
        {
            "name": "claim_with_randomness",
            "visibility": "private",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
            "&signer",
            "u64"
            ],
            "return": []
        },
        {
            "name": "contribute",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
            "&signer",
            "u64"
            ],
            "return": []
        },
        {
            "name": "get_balance",
            "visibility": "public",
            "is_entry": false,
            "is_view": false,
            "generic_type_params": [],
            "params": [],
            "return": [
            "u64"
            ]
        },
        {
            "name": "initialize",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
            "&signer",
            "u64"
            ],
            "return": []
        }
        ],
        "structs": [
        {
            "name": "FaucetData",
            "is_native": false,
            "is_event": false,
            "abilities": [
            "key"
            ],
            "generic_type_params": [],
            "fields": [
            {
                "name": "balance",
                "type": "0x1::coin::Coin<0x1::aptos_coin::AptosCoin>"
            },
            {
                "name": "owner",
                "type": "address"
            }
            ]
        }
        ]
    }
