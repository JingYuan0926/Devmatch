module my_addr::nft_collection {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_token::token;
    use aptos_token::token::TokenDataId;
    use aptos_std::table::{Self, Table};

    // Errors
    const ENO_COLLECTION_MINTED: u64 = 1;
    const ECOLLECTION_ALREADY_MINTED: u64 = 2;
    const EMINT_LIMIT_REACHED: u64 = 3;
    const EINSUFFICIENT_BALANCE: u64 = 4;
    const EMINTING_NOT_ENABLED: u64 = 5;

    // Structs
    struct CollectionInfo has key {
        name: String,
        description: String,
        uri: String,
        supply: u64,
        minted: u64,
        token_data_id: TokenDataId,
        minters: Table<address, u64>,
        mint_events: EventHandle<MintEvent>,
    }

    struct MintEvent has drop, store {
        minter: address,
        token_data_id: TokenDataId,
        token_name: String,
    }

    // Entry functions
    public entry fun create_collection(
        creator: &signer,
        name: String,
        description: String,
        uri: String,
        max_supply: u64,
    ) {
        let creator_addr = signer::address_of(creator);
        assert!(!exists<CollectionInfo>(creator_addr), error::already_exists(ECOLLECTION_ALREADY_MINTED));

        let collection_name = name;
        token::create_collection(
            creator,
            collection_name,
            description,
            uri,
            max_supply,
            vector<bool>[false, false, false]
        );

        let token_data_id = token::create_tokendata(
            creator,
            collection_name,
            string::utf8(b"NFT"),
            string::utf8(b""),
            0,
            uri,
            creator_addr,
            1,
            0,
            token::create_token_mutability_config(&vector<bool>[false, false, false, false, true]),
            vector<String>[],
            vector<vector<u8>>[],
            vector<String>[]
        );

        move_to(creator, CollectionInfo {
            name: collection_name,
            description,
            uri,
            supply: max_supply,
            minted: 0,
            token_data_id,
            minters: table::new(),
            mint_events: account::new_event_handle<MintEvent>(creator),
        });
    }

    public entry fun mint_nft(
        receiver: &signer,
        creator_addr: address,
    ) acquires CollectionInfo {
        let receiver_addr = signer::address_of(receiver);
        assert!(exists<CollectionInfo>(creator_addr), error::not_found(ENO_COLLECTION_MINTED));

        let collection_info = borrow_global_mut<CollectionInfo>(creator_addr);
        assert!(collection_info.minted < collection_info.supply, error::invalid_argument(EMINT_LIMIT_REACHED));

        let token_name = string::utf8(b"NFT");
        token::mint_token(
            receiver,
            collection_info.token_data_id,
            1,
        );

        collection_info.minted = collection_info.minted + 1;

        if (!table::contains(&collection_info.minters, receiver_addr)) {
            table::add(&mut collection_info.minters, receiver_addr, 1);
        } else {
            let minted = table::borrow_mut(&mut collection_info.minters, receiver_addr);
            *minted = *minted + 1;
        };

        event::emit_event(&mut collection_info.mint_events, MintEvent {
            minter: receiver_addr,
            token_data_id: collection_info.token_data_id,
            token_name,
        });
    }
}