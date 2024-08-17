module faucet_contract1::faucet1 {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::randomness;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_NOT_OWNER: u64 = 4;
    const E_INSUFFICIENT_USER_BALANCE: u64 = 5;
    const E_INVALID_AMOUNT: u64 = 6;

    // Stores the faucet data
    struct FaucetData has key {
        balance: coin::Coin<AptosCoin>,
        owner: address,
    }

    // Initialize the faucet
    public entry fun initialize(account: &signer, initial_balance: u64) {
        let account_addr = signer::address_of(account);
        assert!(account_addr == @faucet_contract1, E_NOT_OWNER);
        assert!(!exists<FaucetData>(account_addr), E_ALREADY_INITIALIZED);
        
        let coins = coin::withdraw<AptosCoin>(account, initial_balance);
        move_to(account, FaucetData { balance: coins, owner: account_addr });
    }

    // Updated claim function with user-specified amount
    public entry fun claim(account: &signer, amount: u64) acquires FaucetData {
        let account_addr = signer::address_of(account);
        assert!(exists<FaucetData>(@faucet_contract1), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        let faucet_data = borrow_global_mut<FaucetData>(@faucet_contract1);
        assert!(coin::value(&faucet_data.balance) >= amount, E_INSUFFICIENT_BALANCE);
        
        let coins = coin::extract(&mut faucet_data.balance, amount);
        coin::deposit(account_addr, coins);
    }

    // Updated function to claim with randomness
    #[randomness]
    entry fun claim_with_randomness(account: &signer, base_amount: u64) acquires FaucetData {
        let account_addr = signer::address_of(account);
        assert!(exists<FaucetData>(@faucet_contract1), E_NOT_INITIALIZED);
        assert!(base_amount > 0, E_INVALID_AMOUNT);
        
        let faucet_data = borrow_global_mut<FaucetData>(@faucet_contract1);
        
        // Generate a random number between 1 and 10
        let multiplier = randomness::u64_range(1, 11);
        let random_claim_amount = base_amount * multiplier;
        
        assert!(coin::value(&faucet_data.balance) >= random_claim_amount, E_INSUFFICIENT_BALANCE);
        
        let coins = coin::extract(&mut faucet_data.balance, random_claim_amount);
        coin::deposit(account_addr, coins);
    }

    // Updated function to contribute to the faucet
    public entry fun contribute(account: &signer, amount: u64) acquires FaucetData {
        let account_addr = signer::address_of(account);
        assert!(exists<FaucetData>(@faucet_contract1), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        // Check if user has enough balance to contribute
        assert!(coin::balance<AptosCoin>(account_addr) >= amount, E_INSUFFICIENT_USER_BALANCE);

        // Withdraw contribution from user
        let contribution = coin::withdraw<AptosCoin>(account, amount);

        // Add contribution to faucet balance
        let faucet_data = borrow_global_mut<FaucetData>(@faucet_contract1);
        coin::merge(&mut faucet_data.balance, contribution);
    }

    // Get the current balance of the faucet
    public fun get_balance(): u64 acquires FaucetData {
        assert!(exists<FaucetData>(@faucet_contract1), E_NOT_INITIALIZED);
        let faucet_data = borrow_global<FaucetData>(@faucet_contract1);
        coin::value(&faucet_data.balance)
    }

    // Allow the owner to add more funds to the faucet
    public entry fun add_funds(account: &signer, amount: u64) acquires FaucetData {
        let account_addr = signer::address_of(account);
        assert!(exists<FaucetData>(@faucet_contract1), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        
        let faucet_data = borrow_global_mut<FaucetData>(@faucet_contract1);
        assert!(account_addr == faucet_data.owner, E_NOT_OWNER);
        
        let coins = coin::withdraw<AptosCoin>(account, amount);
        coin::merge(&mut faucet_data.balance, coins);
    }
}