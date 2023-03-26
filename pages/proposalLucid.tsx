const createProposal = async () : Promise<TxHash> => {
    if (!lucid){
      throw new Error ("No lucid instance")
    }
    const stakeOwnerPrivKey = generatePrivateKey()
    lucid.selectWalletFromPrivateKey(stakeOwnerPrivKey)
    const stakeOwner = await lucid.wallet.address()
    const { paymentCredential } = getAddressDetails(stakeOwner)
    const pkh = paymentCredentialOf(stakeOwner)

    const utxos = await lucid?.wallet.getUtxos();
    
    const governanceMP : MintingPolicy = {
      type: "PlutusV2",
      script: "323232332232"
    } 
    const governanceCS : PolicyId = lucid.utils.mintingPolicyToId(governanceMP)
    const governanceUnit : Unit = governanceCS + fromText("")

    const governanceValidator : SpendingValidator = {
      type: "PlutusV2",
      script: "323232332232"
    }
    const governanceValidatorAddress : Address = lucid.utils.validatorToAddress(governanceValidator)
    
    const governanceUTxOs : UTxO[] = await lucid.utxosAtWithUnit(governanceValidatorAddress, governanceUnit)

    if (!governanceUTxOs) throw new Error ("No governance UTxOs found")
    const govUTxO : UTxO = governanceUTxOs[0]

    const proposalValidator : SpendingValidator = {
      type: "PlutusV2",
      script: "323232332232" // todo get correct cbor 
    }
    const proposalValidatorAddress : Address = lucid.utils.validatorToAddress(proposalValidator)

    const proposalMintingPolicy : MintingPolicy = {
      type: "PlutusV2",
      script: "323232332232" // todo get correct cbor 
    }
    const proposalCS : PolicyId = lucid.utils.mintingPolicyToId(proposalMintingPolicy);
    const proposalAsset : Assets = {[proposalCS + fromText("")]: BigInt(1)} 

    const tx = await lucid.newTx()
      .addSigner(stakeOwner)
      .mintAssets(proposalAsset)
      .collectFrom([govUTxO], Data.to(0))
      // TODO:  
      //.collectFrom([stakeUTxO], Data.to(0))
      .payToContract(governanceValidatorAddress, {inline: govUTxO.datum!}, govUTxO.assets)
      .payToContract(proposalValidatorAddress, {inline: Data.void()}, {lovelace: BigInt(2_000_000), ...proposalAsset})
      .attachMintingPolicy(proposalMintingPolicy)
      .attachSpendingValidator(governanceValidator)
      .complete()
    
    

    return ""
  }