module nft_creator::nft {
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::signer;
    use aptos_token_objects::token;

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    struct NFT has key {
        name: String,
        description: String,
        image_uri: String,
        creator: address,
        minting_events: event::EventHandle<MintingEvent>,
    }

    struct MintingEvent has drop, store {
        token_id: address,
        creator: address,
        recipient: address,
    }

    public entry fun mint(
        creator: &signer,
        name: String,
        description: String,
        image_uri: String,
        recipient: address
    ) {
        let constructor_ref = object::create_named_object(creator, *string::bytes(&name));
        let object_signer = object::generate_signer(&constructor_ref);

        let nft = NFT {
            name,
            description,
            image_uri,
            creator: signer::address_of(creator),
            minting_events: account::new_event_handle<MintingEvent>(&object_signer),
        };

        let token_id = object::address_from_constructor_ref(&constructor_ref);

        event::emit_event(
            &mut nft.minting_events,
            MintingEvent {
                token_id,
                creator: signer::address_of(creator),
                recipient,
            },
        );

        move_to(&object_signer, nft);

        token::create_token_address(&signer::address_of(creator), &name, &string::utf8(b""));
        object::transfer(creator, object::object_from_constructor_ref<NFT>(&constructor_ref), recipient);
    }

    #[view]
    public fun get_token_info(token: Object<NFT>): (String, String, String, address) {
        let nft = object::borrow<NFT>(&token);
        (
            nft.name,
            nft.description,
            nft.image_uri,
            nft.creator,
        )
    }
}