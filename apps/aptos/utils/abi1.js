export const ABI1  = {
    "address": "0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98",
    "name": "nft_collection",
    "friends": [],
    "exposed_functions": [
      {
        "name": "create_collection",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "0x1::string::String",
          "0x1::string::String",
          "0x1::string::String",
          "u64"
        ],
        "return": []
      },
      {
        "name": "mint_nft",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "address"
        ],
        "return": []
      }
    ],
    "structs": [
      {
        "name": "CollectionInfo",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "name",
            "type": "0x1::string::String"
          },
          {
            "name": "description",
            "type": "0x1::string::String"
          },
          {
            "name": "uri",
            "type": "0x1::string::String"
          },
          {
            "name": "supply",
            "type": "u64"
          },
          {
            "name": "minted",
            "type": "u64"
          },
          {
            "name": "token_data_id",
            "type": "0x3::token::TokenDataId"
          },
          {
            "name": "minters",
            "type": "0x1::table::Table<address, u64>"
          },
          {
            "name": "mint_events",
            "type": "0x1::event::EventHandle<0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98::nft_collection::MintEvent>"
          }
        ]
      },
      {
        "name": "MintEvent",
        "is_native": false,
        "is_event": false,
        "abilities": [
          "drop",
          "store"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "minter",
            "type": "address"
          },
          {
            "name": "token_data_id",
            "type": "0x3::token::TokenDataId"
          },
          {
            "name": "token_name",
            "type": "0x1::string::String"
          }
        ]
      }
    ]
  }
