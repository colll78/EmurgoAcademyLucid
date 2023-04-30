import type { NextPage } from 'next'
import Head from 'next/head'
import WalletConnect from '../components/WalletConnect'
import { useStoreActions, useStoreState } from "../utils/store"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAssets } from "../utils/cardano";
import NftGrid from "../components/NftGrid";
import initLucid from '../utils/lucid'
import { Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy, PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash, generatePrivateKey, getAddressDetails, toUnit } from 'lucid-cardano'
import * as helios from '@hyperionbt/helios'
import {fromAssets, toAssets, union, Value} from "../utils/valueUtils"
import { fromAddress, OfferDatum, OfferInfo, toAddress } from '../utils/offerUtils'


// const cborHex = "590a1901000032323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323232323222253335734646464646a666ae68cdc39aab9d375400c9000092999ab9a337106eb4c038dd60041bad300a37580102660822660822660822660766eaccccc0b0014d5d09bac0080014a06eaccc0e8dd59981598069bac0084c0101010037566605660126eb0020c038dd600409981d9bab333302c0050020014a06eacc0a9301051a004c4b4000133029375a0086eb4c030dd60040998130029aba137580102660822660822660822660822660822660766eaccccc0b0014d5d09bac0080014a06eaccc0acc024dd60041ba8337026eb4c038dd60041bad301037580102660766eaccccc0b0014c03cdd6004000a50375666056601a6eb0021300101010013303b3756666605800a004002940dd598152601051a007270e000133029375a0086eb4c030dd60040998128998130029aba1375801026604c00a601e6eb00204cc0944cdd798081bac0084c0101000013303b3756666605800a60226eb0020005281bab3302b3009375801060206eb0020494ccd5cd19b88375a60680026eb4c028dd60040a5015333573466e24dd6981a0009bad300e3758010294054ccd5cd19b88375a660486eacc0dcc0dcc08c019300106d8799f4040ff00483030e4c1c5280992999ab9a3302a375a601e6eb00252000133042133042133042133042133042133042133023375a6604a6eacc0e0c0e0c09001d30106d8799f4040ff00482036b10244cc0f0dd59999810003002000a513756660766eaccc0ecdd59981618071bac0094c0101010037566605860146eb0024c0d4008dd59815a601051a009896800013303c3756666605a00c60206eb0024009281bab3303b37566605860146eb0024c03cdd60049bab302b4c1051a002625a0001337106eb4014dd698069bac00913302a375a00a6eb4c030dd6004899b89337026eb4c07cc078018dd6980e980f00324101756e0626604e00c60660042660842660842660842660842660842660466eb4cc094dd5981c181c1812003a60106d8799f4040ff00483030e4c1c4cc0f0dd59999810003002000a513756660766eaccc0ecdd59981618071bac0094c0101010037566605860146eb0024c0d4008dd59815a601051a00989680001337106eb4014dd698069bac00913302a375a00a6eb4c030dd6004899b89337026eb4c07cc078018dd6980e980f00324101756e0626604e00c60660046e9ccd5d01aba1375801066ae80d5d09aba2375801066ae80c024dd600419aba0300a375801066ae80d5d0980c9bac00833574060166eb0020cd5d018061bac008335740601a6eb0020cd5d0181a00099aba03032001335740606e00266ae80d5d0981400099aba03011375801066ae80d5d09aba23012375801097ae00064c011e581c89e0e1706f1b825460bd49954cc04dad5159e522e649a1ad17f3988600302f301e302f302f3034302000330183019001302d0011498588d5d0980980091aba13011001235742601c00246ae84c0300048d5d0980500091aba13008001235742600c00246ae84c0100048d5d0980100091aba230020012357446ae88c0080048d5d1180100091aba23002001235744600400246ae88c0080048d5d1180100091aba23002001235744600400246ae88d5d10009180b980b980b80091aba1300b001230153015301a0012222301b3758a666ae680044dd39980c00211981389980300080209980a80080189ba733018004233027133006001004133014001375260260064464a666ae68cdc39aab9d37540029001099baf0023015300400114a060286028004466022002900111180f19b88002001232333001001375860226022004466ebcc048004c048c05c00c8894ccd5cd1aba30021615333573460026ae840084d5d080109998018019aba2002001223233300100122533357346ae8c0045854ccd5cd19baf35573a6ae84004c0600104d55cf1aba100113300200235744002006444a666ae68d5d18008b0a999ab9a3375e6aae74d5d080098098020998010011bab35573c6ae840044ccc00c00c008d5d1000912999ab9a500214a200244660386eb0d5d09aba2300300223375e00200446ae88d5d11aba235744600400246ae88c03800488c05ccdc4801000919801260106d8799f4040ff00001225333573466e1d2000375a0022980101a0001374c66ae80cdd818048011ba633574066ec0c0380080052f5bded8c097adef6c602222300e3758a666ae680044dd39980580211980d09980480080209980400080189ba73300b00423301a1330090010041330070013752600c00646e50dd98009119baf325333573466e1cd55ce800a400426ae84d55cf0008a601014000375460100040024464a666ae68cdc39aab9d001480104cdd78011aba135573c0022940dd5180380111192999ab9a3370e6aae74dd5000a4000266ebc008c014cc010005200014a06008600800444a666ae68cdc39aab9d375400400220042c46ae84c02000488c8ccc004004dd618020018011112999ab9a35746004297ae015333573460026ae840084cd5d01aba10023330030033574400400226660060066ae880080048d5d0980100091aba230040012323333001001002223300837560046eacc014005300101a0002222533357346ae8c00c40044cccc010010d5d1001801198010009aba1003235742600400246ae88c0080048d55cf1baa0012232374c6660020026601000600497adef6c60222533357346ae8c00840044cc88c94ccd5cd1aba30011002133574066ec000cdd30008011991191998008009980780180125eb7bdb1808894ccd5cd1aba3002100113322325333573466e1c00520001002133574066ec000cdd400080119b803301100700233011006002357420046660060066ae88008004cc02401c008cc024018008d5d08011998018019aba20020012232330010013300700300222533357346ae8c0045288992999ab9a3008332232330010013300c00300222533357346ae8c0045288992999ab9a300d300d337106601800a0026601800800229404cc00c00cd5d10011aba1001330060050013300600400114a02660060066ae88008d5d0800911919800800801912999ab9a35746002297adef6c6015333573466ebcd55ce9aba1001003137566aae78d5d08008998010011aba20012232333001001003002222533357346ae8c0085200015333573466ebcd55ce9aba10020011375a6aae78d5d080109998018019aba20020012333573400294128911919191998008009998010010018020019112999ab9a357460022004266ae80d5d08009998018018011aba2001222533357346ae8c00452f5c0264a666ae68cc0200148cdd780080109998020020019aba200213357400026660080080066ae88008d55ce9aba1001323300100100322533357346ae8c00452f5c0266ae80d55ce9aba100133002002357440024464666002002006004444a666ae68d5d18010a5015333573460026ae8400852889998018019aba20020012253335734a0040022941"


// console.log("Logging deserialization of UPLC");
// console.log(helios.deserializeUplc(`{"type": "PlutusScriptV1", "cborHex": "${cborHex}"}`))

const Helios: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet)
  const [nftList, setNftList] = useState([])
  const [lucid, setLucid] = useState<Lucid>()
  const [script, setScript] = useState<SpendingValidator>()
  const [scriptAddress, setScriptAddress] = useState("")
  const [ariadyTxHash, setAriadyTxHash] = useState("")
  const [efrainTxHash, setEfrainTxHash] = useState("")


  useEffect(() => {
    if (lucid) {
      ;
    } else {
      initLucid(walletStore.name).then((Lucid: Lucid) => { setLucid(Lucid) })
    }
  }, [lucid])


  const Metadata333 = Data.Map(Data.Bytes(), Data.Any());
  type Metadata333 = Data.Static<typeof Metadata333>;
  const DatumMetadata = Data.Object({
    metadata: Metadata333,
    version: Data.Integer({ minimum: 1, maximum: 1 }),
    extra: Data.Any(),
  });
  type DatumMetadata = Data.Static<typeof DatumMetadata>;

  type Metadata = {
    name: string;
    description: string;
    ticker?: string;
    url?: string;
    logo?: string;
    decimals?: number;
  };


  const Parameter = Data.Object({
    pubkey_hash: Data.Bytes({ minLength: 28, maxLength: 28 }),
    password: Data.Bytes(),
  });
  
  type Parameter = Data.Static<typeof Parameter>;
  
  const paramScriptCbor = "58e558e30100003232323232323222223232323232533300b323232533300e3370e9000001099919191801119801001000918011198010010009129998090008a50153330113375e602800200629444c008c04c004c044010dd618089808191808980898089808980898089808800980698089806804899baf30110013011301000430110023011001375400e2930b1804804299980499b87480000084c926533300a00114985854ccc024cdc3a40040042646464649329998068008a4c2c601a0066eb8004c03000458c030008c030004dd5001118031baa0015734aae7d5d12ba15573caae75"

  const unlockParamsTest = async () => {
    if (lucid) {
      const {paymentCredential} = lucid.utils.getAddressDetails(await lucid.wallet.address())
      

      const parameter : Parameter = 
        {
          pubkey_hash: paymentCredential!.hash,
          password: fromText("Password12"),
        };
      
      //const parameter = new Constr(0, [paymentCredential!.hash, fromText("Password12")])
      const Redeemer = () => Data.to(new Constr(0, []))
      const paramValidator : SpendingValidator = {
        type: "PlutusV2",
        script: applyParamsToScript<[Parameter]>(paramScriptCbor, [parameter], Data.Tuple([Parameter]),) 
      }
      // ApplyArg 
      const paramTestAddress : Address = lucid.utils.validatorToAddress(paramValidator)
      console.log("Params Test Address: " + paramTestAddress)
      const scriptUTxOs = await lucid.utxosAt(paramTestAddress)
      if (scriptUTxOs.length == 0){ throw new Error("No UTxOs at param script")}
      const paramScriptUTxO : UTxO = scriptUTxOs[0]
      console.log(paramScriptUTxO)
      const tx = await lucid
        .newTx()
        .collectFrom([paramScriptUTxO], Redeemer())
        .addSignerKey(paymentCredential!.hash)
        .attachSpendingValidator(paramValidator)
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      console.log("Unlock Test TxHash: " + txHash)
      return txHash;
    }
  }

  const lockParamsTest = async () => {
    if (lucid) {
      const {paymentCredential} = lucid.utils.getAddressDetails(await lucid.wallet.address())
      console.log(paymentCredential!.hash)
      const parameter : Parameter = 
      {
        pubkey_hash: paymentCredential!.hash,
        password: fromText("Password12"),
      };
      //const parameter = new Constr(0, [paymentCredential!.hash, fromText("Password12")])
      const Redeemer = () => Data.to(new Constr(0, []))
      const paramValidator : SpendingValidator = {
        type: "PlutusV2",
        script: applyParamsToScript<[Parameter]>(paramScriptCbor, [parameter], Data.Tuple([Parameter]),) 
      }
      const paramTestAddress : Address = lucid.utils.validatorToAddress(paramValidator)
      
      
      const tx = await lucid
        .newTx()
        .payToContract(paramTestAddress, {inline: Data.void()}, {lovelace: BigInt(5_000_000)})
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      console.log("Lock Test TxHash: " + txHash)
      return txHash;
    }
  }


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
      // send proper datum to proposal validator address
      .payToContract(proposalValidatorAddress, {inline: Data.void()}, {lovelace: BigInt(2_000_000), ...proposalAsset})
      .attachMintingPolicy(proposalMintingPolicy)
      .attachSpendingValidator(governanceValidator)
      .complete()
    return ""
  }

  const mintCoffeeBag = async () : Promise<any> => {
    if (lucid) {
      const coffeeCbor = "5908295908260100003232323233223232323232323232323322323232323232232223232533533223232323500322222222222233355301812001323212330012233350052200200200100235001220011233001225335002102d100102a25335333573466e3c03cd400488d4008880080ac0a84ccd5cd19b8700e3500122350022200102b02a102a00c3235001220015009323500122002500835001220023333573466e1cd55ce9baa0044800080708c98c8070cd5ce00e80e00d1999ab9a3370e6aae7540092000233221233001003002323232323232323232323232323333573466e1cd55cea8062400046666666666664444444444442466666666666600201a01801601401201000e00c00a00800600466a02e0306ae854030cd405c060d5d0a80599a80b80c9aba1500a3335501b75ca0346ae854024ccd5406dd7280d1aba1500833501702235742a00e666aa036046eb4d5d0a8031919191999ab9a3370e6aae75400920002332212330010030023232323333573466e1cd55cea8012400046644246600200600466a05aeb4d5d0a80118171aba135744a004464c6406466ae700cc0c80c04d55cf280089baa00135742a0046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b5d69aba15002302e357426ae8940088c98c80c8cd5ce01981901809aab9e5001137540026ae84d5d1280111931901719ab9c02f02e02c135573ca00226ea8004d5d0a80299a80bbae35742a008666aa03603e40026ae85400cccd5406dd710009aba150023021357426ae8940088c98c80a8cd5ce01581501409aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023011357426ae8940088c98c8070cd5ce00e80e00d080d89931900d99ab9c491035054350001b135573ca00226ea80044c030004c8004d5405888448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80b111999aab9f0012500a233500930043574200460066ae880080588c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8058cd5ce00b80b00a09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c806ccd5ce00e00d80c89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403a66ae7007807406c0680644d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201733573803002e02a26ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355013223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301413574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900919ab9c01301201000f135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900919ab9c01301201000f00e00d135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900719ab9c00f00e00c135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8030cd5ce00680600509baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8054cd5ce00b00a80980900880800780700689aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401c66ae7003c03803002c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200b33573801801601201026aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401866ae700340300280240204d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200833573801201000c00a26aae74dd5000891001091000a4c2400292010350543100112323001001223300330020020011"
      const MintRedeemer = () => Data.to(new Constr(0, []))
      const BurnRedeemer = () => Data.to(new Constr(1, []))

      const utxos = await lucid.wallet.getUtxos(); 
      
      if(utxos.length == 0) throw 'No UTxO available';
      
      const daoAddress = "addr123213"
      const daoPKH : KeyHash = paymentCredentialOf(daoAddress).hash
      const mintingPolicy: MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript(coffeeCbor, [daoPKH]),
      };

      const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
      const mintIdx = 0; 
      const tokenName = fromText('Coffee #{mintIdx}');
      const assetToMint: Unit = policyId + tokenName;
      
      const tx = await lucid
        .newTx()
        .mintAssets({ [assetToMint]: BigInt(1) }, MintRedeemer())
        .payToAddress(daoAddress, {lovelace: BigInt(45_000_000)})
        .attachMintingPolicy(mintingPolicy)
        .addSignerKey(daoPKH)
        .complete();

      const daoWitness = await tx.partialSign()
      return {transaction: tx, witness: daoWitness} 
    }
  }
  
  const mintCoffeeBagFrontEnd = async (partialTx : any) : Promise<any> => {
    if (lucid) {
      const userWitness = await partialTx.transaction.partialSign();
      const signedTx = partialTx.transaction.assemble([userWitness, partialTx.witness]).complete();
      const txHash = signedTx.submit();
    }
  }
  
  const mintNFT = async () => {
    if (lucid){
      const utxos = await lucid.wallet.getUtxos(); //(await lucid?.utxosAt(await lucid.wallet.address()))
      const txOutId = utxos[0].txHash

      const txId =  new Constr(0, [txOutId])
      const txIndex = BigInt(utxos[0].outputIndex)
      const txOutRefParam = new Constr(0, [txId, txIndex])  
  
      const scriptBytes = "5907945907910100003233223232323232323232323232323322323232323222232325335332232333573466e1c005"
      const mintingScript = applyParamsToScript(scriptBytes, [txOutRefParam],)

      const mintingPolicy : MintingPolicy = {type: "PlutusV2", script: mintingScript}
      const policyId : PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy,);

      const tokenName = fromText("Our Token")
      
      const assetToMint : Unit = policyId + tokenName

      const tx = await lucid.newTx()
        .collectFrom([utxos[0]])
        .mintAssets({[assetToMint]: BigInt(1)})
        .attachMintingPolicy(mintingPolicy)
        .complete();
      
      const signedTx = await tx.sign().complete()
      const txHash = await signedTx.submit()
    }
  }
  
  const OneShotScript = "5908295908260100003232323233223232323232323232323322323232323232232223232533533223232323500322222222222233355301812001323212330012233350052200200200100235001220011233001225335002102d100102a25335333573466e3c03cd400488d4008880080ac0a84ccd5cd19b8700e3500122350022200102b02a102a00c3235001220015009323500122002500835001220023333573466e1cd55ce9baa0044800080708c98c8070cd5ce00e80e00d1999ab9a3370e6aae7540092000233221233001003002323232323232323232323232323333573466e1cd55cea8062400046666666666664444444444442466666666666600201a01801601401201000e00c00a00800600466a02e0306ae854030cd405c060d5d0a80599a80b80c9aba1500a3335501b75ca0346ae854024ccd5406dd7280d1aba1500833501702235742a00e666aa036046eb4d5d0a8031919191999ab9a3370e6aae75400920002332212330010030023232323333573466e1cd55cea8012400046644246600200600466a05aeb4d5d0a80118171aba135744a004464c6406466ae700cc0c80c04d55cf280089baa00135742a0046464646666ae68cdc39aab9d5002480008cc8848cc00400c008cd40b5d69aba15002302e357426ae8940088c98c80c8cd5ce01981901809aab9e5001137540026ae84d5d1280111931901719ab9c02f02e02c135573ca00226ea8004d5d0a80299a80bbae35742a008666aa03603e40026ae85400cccd5406dd710009aba150023021357426ae8940088c98c80a8cd5ce01581501409aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023011357426ae8940088c98c8070cd5ce00e80e00d080d89931900d99ab9c491035054350001b135573ca00226ea80044c030004c8004d5405888448894cd40044d400c88004884ccd401488008c010008ccd54c01c4800401401000448c88c008dd6000990009aa80b111999aab9f0012500a233500930043574200460066ae880080588c8c8cccd5cd19b8735573aa004900011991091980080180118061aba150023005357426ae8940088c98c8058cd5ce00b80b00a09aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180a9aba1500233500f014357426ae8940088c98c806ccd5ce00e00d80c89aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403a66ae7007807406c0680644d55cea80089baa00135742a00466a016eb8d5d09aba2500223263201733573803002e02a26ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355013223233335573e0044a010466a00e66442466002006004600c6aae754008c014d55cf280118021aba200301413574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900919ab9c01301201000f135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900919ab9c01301201000f00e00d135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900719ab9c00f00e00c135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8030cd5ce00680600509baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8054cd5ce00b00a80980900880800780700689aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401c66ae7003c03803002c4d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200b33573801801601201026aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401866ae700340300280240204d55cea80089baa0012323333573466e1d40052002200523333573466e1d40092000200523263200833573801201000c00a26aae74dd5000891001091000a4c2400292010350543100112323001001223300330020020011"
/*   {-# INLINEABLE oneShotValidate #-}
      oneShotValidate :: Api.TxOutRef -> () -> Api.ScriptContext -> Bool
      oneShotValidate oref () ctx = Api.spendsOutput txInfo (Api.txOutRefId oref) (Api.txOutRefIdx oref)
        where
          txInfo :: Api.TxInfo
          txInfo = Api.scriptContextTxInfo ctx

      oneShotInstance :: Scripts.MintingPolicy
      oneShotInstance = Api.MintingPolicy $ Api.fromCompiledCode ($$(PlutusTx.compile [|| wrap ||]))
        where
          wrap oref = Scripts.mkUntypedMintingPolicy $ oneShotValidate (PlutusTx.unsafeFromBuiltinData oref)
    
      oneShotSerialized :: String
      oneShotSerialized = C.unpack $ B16.encode $ serialiseToCBOR 
                            ((PlutusScriptSerialised $ SBS.toShort . LBS.toStrict $ serialise $ Api.unMintingPolicyScript oneShotInstance) :: PlutusScript PlutusScriptV2)
*/

  const alwaysSucceeds = "49480100002221200101"
  /* alwaysSucceeds :: Integer -> () -> ScriptContext -> Bool
     alwaysSucceeds _ _ _ = True
  */
 
  const mintOneshot = async () => {
    if (lucid) {
      const Redeemer = () => Data.void();
      
      //const ownerAddress = (await lucid.wallet.address()); // get current connected wallet
      const utxos : UTxO[] = await lucid.wallet.getUtxos(); // get wallet UTxO list
      
      if(utxos.length == 0) throw 'No UTxO available';
      //TxOutRef TxId TxIdx 
      const txId = new Constr (0, [utxos[0].txHash])
      const txIdx = BigInt(utxos[0].outputIndex)

      const txOutRef = new Constr (0, [txId, txIdx])

      const mintingPolicy: MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript(OneShotScript, [txOutRef]),
      };

      const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
      const tokenName = fromText('FooToken');
      const assetToMint: Unit = policyId + tokenName;
      
      const tx = await lucid
        .newTx()
        .mintAssets({ [assetToMint]: BigInt(1) })
        .attachMintingPolicy(mintingPolicy)
        .collectFrom([utxos[0]], Redeemer())
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
    }
  }

  
  const mintExample = async (metaData: any) => {
    if (lucid){
      const collectionSize = 1;

      const utxos = await lucid.wallet.getUtxos();
      if(utxos.length == 0) throw 'No UTxO available';
      //TxOutRef TxId TxIdx 
      const txId = new Constr (0, [utxos[0].txHash])
      const txIdx = BigInt(utxos[0].outputIndex)
      const txOutRef = new Constr (0, [txId, txIdx])
      const bulkParams = new Constr(0, [txOutRef, collectionSize]);
      const bulkMintScript =
      '59022659022301000032323232323232323232323232323232222323232323253330133370e90000010991919191919299980c991919299980e19b874800000854cc048cdc38031bad301e301f00e15330123370e00a9000099199180e11299980f8008a50153323302100114a26006604400226004604600246466ebcdd398118019ba7302300130203022001005301e00e15330123370e00c90000a9980919b88005480004cc8c06c894ccc0780045288a9980a98019810800898011811000919299980f19b8848000cc05802cdd59810181098110008991919299981099b87480080085280a513025002302000137546460426046002604060440022944c07cc080c084004010c080008c06c004dd50068a4c2c6eb0c068010ccc0408cdc4000a40000080046601c0060026eacc05cc8c064c064c064004c060004c060c058014dd7180a8008b180b80118090009baa30123013001301300230120032233300c00200100314a06002466e21200000122233333300400b00f375200400246660104464a66601c600e002266e000040084008dd69809001240006eac004520002222333300533006004002001232223002003300400112250012300422533300700112250011333003300a001222300200313002300b00122253330073375e00460060022446004006244a00244600644a66600c0022006266008601200260046014002464600446600400400246004466004004002aae7d5cd2ab9d5742ae888c008dd5000aab9e1';
      const bulkMintingPolicy : MintingPolicy = 
        {
          type: "PlutusV2",
          script: applyParamsToScript(bulkMintScript, [bulkParams])
        }
      const policyId : PolicyId = lucid.utils.mintingPolicyToId(bulkMintingPolicy)
      const tokenName = fromText("Token")
      const assetToMint : Unit = policyId + tokenName 
      
      const MintRedeemer = Data.to(new Constr(0, []))
      const transaction = lucid
        .newTx()
        .collectFrom(utxos)
        .mintAssets({[assetToMint]: BigInt(1)}, MintRedeemer)
        .attachMintingPolicy(bulkMintingPolicy)
      
      if(metaData){
        transaction.attachMetadata(721, metaData)
      }
      const tx = await transaction.complete(); 
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
      }
  }

  const burnExample = async (metaData: any) => {
    if (lucid){
      const collectionSize = 1;

      const utxos = await lucid.wallet.getUtxos();
      if(utxos.length == 0) throw 'No UTxO available';
      //TxOutRef TxId TxIdx 
      const txId = new Constr (0, [utxos[0].txHash])
      const txIdx = BigInt(utxos[0].outputIndex)
      const txOutRef = new Constr (0, [txId, txIdx])
      const bulkParams = new Constr(0, [txOutRef, collectionSize]);
      const bulkMintScript =
      '59022659022301000032323232323232323232323232323232222323232323253330133370e90000010991919191919299980c991919299980e19b874800000854cc048cdc38031bad301e301f00e15330123370e00a9000099199180e11299980f8008a50153323302100114a26006604400226004604600246466ebcdd398118019ba7302300130203022001005301e00e15330123370e00c90000a9980919b88005480004cc8c06c894ccc0780045288a9980a98019810800898011811000919299980f19b8848000cc05802cdd59810181098110008991919299981099b87480080085280a513025002302000137546460426046002604060440022944c07cc080c084004010c080008c06c004dd50068a4c2c6eb0c068010ccc0408cdc4000a40000080046601c0060026eacc05cc8c064c064c064004c060004c060c058014dd7180a8008b180b80118090009baa30123013001301300230120032233300c00200100314a06002466e21200000122233333300400b00f375200400246660104464a66601c600e002266e000040084008dd69809001240006eac004520002222333300533006004002001232223002003300400112250012300422533300700112250011333003300a001222300200313002300b00122253330073375e00460060022446004006244a00244600644a66600c0022006266008601200260046014002464600446600400400246004466004004002aae7d5cd2ab9d5742ae888c008dd5000aab9e1';
      const bulkMintingPolicy : MintingPolicy = 
        {
          type: "PlutusV2",
          script: applyParamsToScript(bulkMintScript, [bulkParams])
        }
      const policyId : PolicyId = lucid.utils.mintingPolicyToId(bulkMintingPolicy)
      const tokenName = fromText("Token")
      const assetToMint : Unit = policyId + tokenName 
      
      const BurnRedeemer = Data.to(new Constr(1, []))
      const transaction = lucid
        .newTx()
        .collectFrom(utxos)
        .mintAssets({[assetToMint]: BigInt(-1)}, BurnRedeemer)
        .attachMintingPolicy(bulkMintingPolicy)
      
      if(metaData){
        transaction.attachMetadata(721, metaData)
      }
      const tx = await transaction.complete(); 
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash;
      }
  }


  const lockReferenceInputExample = async() => {
    const AlwaysSucceedsScript : SpendingValidator = {
      type: "PlutusV2",
      script: alwaysSucceeds
    }
    const AlwaysFailsScript : SpendingValidator = {
      type: "PlutusV2",
      script: "49480100002221200102"
    }

    if (lucid){
      const scriptAddress = lucid.utils.validatorToAddress(AlwaysSucceedsScript)
      const failScriptAddr = lucid.utils.validatorToAddress(AlwaysFailsScript)
		  const efrainDatum = BigInt(27)
		  const tx = await lucid
			  .newTx()
			  .payToContract(scriptAddress, {inline: Data.to(efrainDatum)}, {lovelace: BigInt(9_000_000)})
        .payToContract(failScriptAddr, {asHash: Data.void(), scriptRef: AlwaysSucceedsScript}, {})
			  .complete();
			const signedTx = await tx.sign().complete();
			const txHash = await signedTx.submit();
			setEfrainTxHash(txHash);
    }
  }
  
  const directOfferCbor = "5902ef5902ec0100003232323232323232323232323232323232323232323232222232323232323232533301c3370e9001001099191919299981019b87480080084c8c8c94ccc08cc8c8c94ccc098cdc3a400000426464a660366466032466034466e24dd698188009991199980f001240004666603e00490003ad375600200c6eb8c0b4008dd718168009bab30300010013756605860560262a660366603a02e6eb0c0b0c078c0ac0404018dd59815981518160009929998130008b0a99981398109815000898158008b19810991198148011816181680098150088030a99981319b87480080084c8c8c94ccc0a4cdc3a400400429404cc078c0b4004dd61816980f9816008981700118148009baa32302b302c001302a011132323253330293370e90000010a9980e1980f18168009bac302d301f302c011100714a0605c00460520026ea8c8c0acc0b0004c0a8044c0ac008c098004dd50080a4c2c603800266038644646464a66604c66e1d200000214a0266e3cdd71815000802981580118130009baa323028302900130273028001375c604a0040026eb0c09002058c094008c080004dd519181118118009810800981099911980e11299980f8008b0992999810998110021812800898129812000898019812001181298120008011bac30200053020001163021002301c0013754603a60380066036603600260386036002603600460340064601e44a666024002294454cc018c00cc05c0044c008c0580048c008dd480091111980811299980980088028a99980a19baf3016301800100613004301a30180011300230170010012233300f00200100314a04601444a66601a002294054ccc038cdd798090008018a511300230110012300e30020012300d30020012300c30020012300b300b00157464600844a66600e0022008264a666012600800226600c00260066018004260066018004601800297ae05740464600446600400400246004466004004002aae7d5cd1119baf374e600c0046e9cc01800555ceaba25742460046ea800555cf01"

  const acceptOffer = async (offerInfo : OfferInfo) : Promise<TxHash> => {
    if (lucid){
        const PAcceptOfferRedeemer = Data.to(new Constr(0, []))
        const tx = await lucid.newTx()
          .collectFrom([offerInfo.offerUTxO!], PAcceptOfferRedeemer)
          .payToAddress(offerInfo.creator, toAssets(offerInfo.toBuy))
          .complete();
        const signedTx = await tx.sign().complete()
        const txHash = await signedTx.submit();
        return txHash;
    } else {
      throw new Error ("lucid not yet initialized");
    }
  }

  const cancelOffer = async (offeree : Credential) : Promise<TxHash> => {
    const DirectOfferValidator : SpendingValidator = {
      type: "PlutusV2",
      script: applyParamsToScript(directOfferCbor, [offeree.hash]), 
    }
    if (offeree.type == "Script"){ throw new Error("invalid offeree")}
    
    if (lucid){
      const directOfferAddress = lucid.utils.validatorToAddress(DirectOfferValidator)
      const ownAddress : Address = await lucid.wallet.address()
      
      let dat : OfferDatum | undefined = undefined;
      const offerUTxOs = await lucid.utxosAt(directOfferAddress)
      let ownOffer : UTxO | undefined = undefined;
      if (!offerUTxOs.length){
        console.log("No offers found for " + offeree.hash);
      }
      for (let i = 0; i < offerUTxOs.length; i++) {
        dat = Data.from<OfferDatum>(offerUTxOs[i].datum!, OfferDatum)
        if ("PublicKeyCredential" in dat!.creator.paymentCredential
          && (dat!.creator.paymentCredential.PublicKeyCredential[0] == paymentCredentialOf(ownAddress).hash)) {
            ownOffer = offerUTxOs[i];
            break;
        }
      } 
      if (ownOffer){
        const PCancelOfferRedeemer = Data.to(new Constr(2, []))
        const tx = await lucid.newTx()
          .collectFrom([ownOffer!], PCancelOfferRedeemer)
          .complete();
        const signedTx = await tx.sign().complete()
        const txHash = await signedTx.submit();
        return txHash;
      } else {
        throw new Error ("no existing offers to offere from current user");
      }
    } else {
      throw new Error ("lucid not yet initialized");
    }
  }

  const makeOffer = async (offer : Assets, toBuy : Assets, offeree : Credential) : Promise<TxHash> => {
    const DirectOfferValidator : SpendingValidator = {
      type: "PlutusV2",
      script: applyParamsToScript(directOfferCbor, [offeree.hash]), 
    }
    if (offeree.type == "Script"){ throw new Error("invalid offeree")}
    const toBuyValue : Value = fromAssets(toBuy)
    if (lucid){
      const directOfferAddress = lucid.utils.validatorToAddress(DirectOfferValidator)
      const ownAddress : Address = await lucid.wallet.address()
      const currOffer : OfferDatum = {
        creator: fromAddress(ownAddress),
        toBuy: toBuyValue
      }
      const DirectDatum =  Data.to<OfferDatum>(currOffer, OfferDatum)
      const tx = await lucid.newTx()
        .payToContract(directOfferAddress, {inline: DirectDatum}, offer)
        .complete();
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit()
      return txHash; 
    } else {
      throw new Error("lucid not yet initialized")
    }
  }
  
  const getOffers = async (pkh : Credential) : Promise<OfferInfo[]> => {
    const DirectOfferValidator : SpendingValidator = {
      type: "PlutusV2",
      script: applyParamsToScript(directOfferCbor, [pkh.hash]), 
    }
    let offerInfos : OfferInfo[] = []
    if (lucid){
      const directOfferAddress = lucid.utils.validatorToAddress(DirectOfferValidator)
      let dat : OfferDatum;
      const offerUTxOs = await lucid.utxosAt(directOfferAddress)
      if (!offerUTxOs.length){
        console.log("No offers found for " + pkh);
        return offerInfos
      }
      for(let i = 0; i < offerUTxOs.length; i++){
        dat = Data.from<OfferDatum>(offerUTxOs[i].datum!, OfferDatum)
        if("PublicKeyCredential" in dat!.creator){
          const currOffer : OfferInfo = {
            creator: toAddress(dat.creator, lucid),
            toBuy: dat.toBuy,
            offer: fromAssets(offerUTxOs[i].assets),
            offerUTxO: offerUTxOs[i]
          }
          offerInfos.push(currOffer)
        }
      }
    }
    return offerInfos
  }

  const deploySequentialMint = async(nftName : string ) => {
    const sequentialNFTCbor = "5901e05901dd0100003232323232323232323232323232322223332223232323253330143370e900000109919191919191919299980e19b874800800854ccc0714cc04ccdc4802a4000266e1c011200214985854ccc0714cc04ccdc3802a40042a6602666e1c01120001332301b22533301e00114a02a664660400022944c00cc0840044c008c0880048c8c8c8c94ccc084cdc3a400000429404cdc79bae3023001014302500230200013754646042604600260406044002603e604060420026eb0c078020526163020002301b0013754016666022466e200052000375c603400a004666020466e212000001375c60320080026eacc060c064c064004c060c060004c060c05801058c060008c04c004dd51809980a000980a0009bae0030020012233300b00200100314a044466666600801601e6ea40080048ccc02088c94ccc038c01c0044cdc000080108011bad301200248000dd58008a40004444666600a6600c0080040024644460040066008002244a0024600844a66600e002244a002266600660140024446004006260046016002444a66600e66ebc008c00c004488c00800c489400488c00c894ccc018004400c4cc010c024004c008c0280048c8c0088cc0080080048c0088cc00800800555cfab9a5573aae855d1118011baa0015573d"
    const seqStateCbor = "5902e75902e401000032323232323232323232323232323232323222233223232323253330183370e9000001099191919299980e191919299980f99b874800000854cc050cdc3802a40042a6602866e1c011200015330143322332301e22533302500114a02a6646604a0022944c00cc0840044c008c0880048c8cdd79ba73022003374e6044002603e60420020046eb0c07001c0404c8ccc0800052825135746664603844a666046002297ae013253330233004001133574000260066042004260066042004603e002464646464a66604866e1d200000214a02a6603266e3cdd71810800980c1bab30213022302200b13370e666444666603200490001199980d00124000eb4dd58008019bab30213022302200b375c604201a60306eacc084c088c08802d200230250023025001375464603e6042002603c002603e0026eb0c07001854cc050cdc4802a4000266e1c01120023020002302000137540142930b199809119b8800148000dd7180c0021bab30183019301900233301123371090000009bae30170033756602e60306030002602e602e002602e602a0082c603200460320026ea8c048c04c004c04c004c8c8c8c80194ccc054cdc3a400000426493299980b0008a4c2c2a66602a66e1d20020021324994ccc0580045261616301600230160013754004002460046ea40048888cc034894ccc050004401454ccc04ccdd7980b180800080309802180a980800089801180880080091bae3010300a3756601e60140024466601a0040020062940888cccccc01003c038dd48010009199804111929998081803800899b800010021002375a602200490001bab0011480008888cccc014cc0180100080048c888c00800cc01000448940048c010894ccc02c00448940044ccc00cc01c004888c00800c4c008c0200048894ccc024cdd78011801800891180100189128009118019129998050008801899802180300098011803800919180111980100100091801119801001000aba15744460086ea80055cd2ab9f5573caae75"

    if (lucid){
      const utxos = await lucid.wallet.getUtxos(); 
      const txOutId = utxos[0].txHash

      const txOutRefParam = new Constr(0, [       //TxOutRef
        new Constr(0, [ //TxId
        txOutId,
        ]),
        BigInt(utxos[0].outputIndex), // Integer 
      ])

      const SeqStateMintingPolicy : MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript(seqStateCbor, [txOutRefParam]), 
      }
      const seqStateCS : PolicyId = lucid.utils.mintingPolicyToId(SeqStateMintingPolicy)

      const SequenceValidator : SpendingValidator = {
        type: "PlutusV2",
        script: "5902d65902d30100003232323232323232323232323232222232323232323253330133370e9001001099191919191919191919299980e99b87480080084c8c8c8c8c8c94ccc08ccdc3a4000004264646464a66604e66e1d200400213253330285330210091533021337100026eb4c0a8c0ac06854cc084cdd79815002981518158078a9981099b8732375a6056605a002646464646400aa66605866e1d20000021323232324994ccc0b8004526163031003375a002605c0022c606000460560026ea8004c0a8008cdc0000a4004266e1cccc08cdd598150029bae302a01b00b4800852616375a6052605603a2c6056004604c0026ea8c098c09c004c098c09d4ccc0880145854ccc08cc06cc0980144c0940145854ccc08d4cc070c06c01454cc070cdc399980f1bab302500d375c604a02c00c6466e0520000014800840105261630270023022001375402a664603c44a666042002294054ccc088cdd798120008018a51130023025001302101137586042010664603a44a666040002297ae01325333022300400113357400026006604a00426006604a00460460024646464a66604466e1d200000214a0266e3cdd71812000802981300118108009baa323022302400130213023001375860400126eb8c07c00458c084008c070004dd519180e980f800980e000980e80099911980c11299980d8008b099299980e9919baf374e604400a6e9cc088004c07c0044c07cc0800044c00cc080008c080c078004008dd6180d00200299180d980d980d800980d000980c980c800980c180c000980c180b002980a8008b180b80118090009baa301230130013013003301100130110045746446660120040020062940888cccc01000920002333300500248001d69bab00100323002375200244446600a44a666010002200a2a66601266ebcc028c02c0040184c010c038c02c0044c008c0300040048c8c0088cc0080080048c0088cc00800800555cfab9a5573aae855d1118011baa0015573d"
      }  
      const seqValHash : ScriptHash = lucid.utils.validatorToScriptHash(SequenceValidator);

      const SeqNFTMintingPolicy : MintingPolicy = {
        type: "PlutusV2",
        script: applyParamsToScript(sequentialNFTCbor, [seqValHash, seqStateCS])
      }
      const seqNFTCS : PolicyId = lucid.utils.mintingPolicyToId(SeqNFTMintingPolicy)

      const PMintStateThread : Redeemer = Data.to(new Constr(0, []))
      const PMintFirstNFT : Redeemer = Data.to(new Constr(3, []))
      const seqValidatorAddress : Address = lucid.utils.validatorToAddress(SequenceValidator)
       
      const seqStateToMint : Unit = seqStateCS + seqValHash
      const nftToMint : Unit = seqNFTCS + fromText(nftName)
      const seqStateMintVal : Assets = {[seqStateToMint] : BigInt(1)} 
      const nftMintVal : Assets = {[nftToMint] : BigInt(1)}
      const adaValue : Assets = {"lovelace" : BigInt(2_000_000)}   

      const seqValidatorDatum = new Constr (0, [])
		  const tx = await lucid
			  .newTx()
        .collectFrom([utxos[0]])  
        .mintAssets(seqStateMintVal, PMintStateThread)
        .mintAssets(nftMintVal, PMintFirstNFT)
			  .payToContract(seqValidatorAddress, {inline: Data.to(seqValidatorDatum)}, seqStateMintVal)
			  .complete();
			const signedTx = await tx.sign().complete();
			const txHash = await signedTx.submit();
    }
  }
  

  // txSignedBy 

  const vestingValidator = "5907945907910100003233223232323232323232323232323322323232323222232325335332232333573466e1c005"
  const readReferenceInputExample = async() => {
    const AlwaysSucceedsScript : SpendingValidator = {
      type: "PlutusV2",
      script: alwaysSucceeds
    }
    const AlwaysFailsScript : SpendingValidator = {
      type: "PlutusV2",
      script: "49480100002221200102"
    }
    if (lucid){
      // user pkh 
      const {paymentCredential} = lucid.utils.getAddressDetails(await lucid.wallet.address());
      
      const succeedsAddress = lucid.utils.validatorToAddress(AlwaysSucceedsScript)
      const failScriptAddr = lucid.utils.validatorToAddress(AlwaysFailsScript)
      const Redeemer = () => Data.void();
      const txIn : UTxO = (await lucid.utxosAt(succeedsAddress))[0]
      const referenceScriptUtxo = (await lucid.utxosAt(failScriptAddr)).find((utxo) => utxo.scriptRef == AlwaysSucceedsScript)!
      if (!referenceScriptUtxo) throw new Error("Reference script not found");
      
      // console.log(referenceScriptUtxo.datum)
      // txInfoValidityRange
      const tx = await lucid
        .newTx()
        //.attachSpendingValidator(AlwaysSucceedsScript)
        .readFrom([referenceScriptUtxo])
        .collectFrom([txIn], Data.void())
        .addSignerKey(paymentCredential?.hash!)
        .validFrom(Date.now())
        .validTo(Date.now() + 10_000)
        .complete();
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
      return txHash
    }
  }

  const datumExampleLock = async () => {
    const AlwaysSucceedsScript : SpendingValidator = {
      type: "PlutusV2",
      script: alwaysSucceeds
    }
    if (lucid) {
      const scriptAddress = lucid.utils.validatorToAddress(AlwaysSucceedsScript);

      /*
      data Game = Game
        { gFirst          :: !PaymentPubKeyHash
        , gSecond         :: !PaymentPubKeyHash
        , gStake          :: !Integer
        , gPlayDeadline   :: !POSIXTime
        , gRevealDeadline :: !POSIXTime
        , gToken          :: !AssetClass
        }
      */
      const gFirst = new Constr(0, ['deadbeef']);
      const gSecond = new Constr(0, [fromText('2ndPKH')]);
      const gStake = BigInt(5_000000);
      const gPlayDeadline = BigInt(new Date('2/1/2023').getTime());
      const gRevealDeadline = BigInt(new Date('2/8/2023').getTime());
      const gToken = new Constr(0, [new Constr (0, ["deadbeef"]), new Constr(0, [fromText("gameToken")])])
      const ariadyDatum = new Constr(0, [
        gFirst,
        gSecond,
        gStake,
        gPlayDeadline,
        gRevealDeadline,
        gToken,
      ]);
      
      const tx = await lucid
        .newTx()
        .payToContract(
          scriptAddress, // address
          {
            inline: Data.to(ariadyDatum), // outputData
          },
          {
            lovelace: BigInt(5_000000), // assets
          }
        )
        .complete();
        
        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        setAriadyTxHash(txHash); // save txHash to ariadyTxHash by setState()
        return txHash;
    }
  }

  
  const giveAda = async () => {
    if (lucid) {
      const receiving_addr : string = "addr_test1qryc5tck5kqqs3arcqnl4lplvw5yg2ujsdnhx5eawn9lyzzvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsg03qnh"
      const {paymentCredential} = lucid.utils.getAddressDetails(receiving_addr)

      const userWallet = await lucid.wallet.address();
      const royaltyAddress = new Constr(0, [new Constr(0, [paymentCredential!.hash]), new Constr(1, [])]);

      const redeemer = Data.to(new Constr (0, [royaltyAddress, BigInt(5)]));

      const giveArgs = 
        [{address: "addr_test1qryc5tck5kqqs3arcqnl4lplvw5yg2ujsdnhx5eawn9lyzzvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsg03qnh", amnt: 5},
         {address: "addr_test2qryc5tck5kqqs3arcqnl4lplvw5yg2ujsdnhx5eawn9lyzzvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsg03qnh", amnt: 6},
        ]
      const tx = await lucid.newTx();
      
      for(let i = 0; i < giveArgs.length; i++){
        tx.payToAddress(giveArgs[i].address, {lovelace: BigInt(giveArgs[i].amnt)})
      }
      const finalTx = await tx.complete();
      const signedTx = await finalTx.sign().complete();
      
      const txHash = await signedTx.submit();
    }
  }

  const lockAlwaysSucceeds = async () => {
    if (lucid) {
      const walletDetails = lucid.utils.getAddressDetails(await lucid.wallet.address(),);
      const AlwaysSucceedsScript : SpendingValidator = {
        type: "PlutusV2",
        script: alwaysSucceeds,
      }
      const alwaysSucceedsScriptAddr = lucid.utils.validatorToAddress(AlwaysSucceedsScript);
      const datum = Data.void();
      const unit = ""+"" 

      const tx = await lucid.newTx()
        .payToContract(alwaysSucceedsScriptAddr, datum, {[unit]: BigInt(1000000)})
        .complete();

      const txSigned = await tx.sign().complete();
      const txHash = await txSigned.submit()
    }
  }

  const redeemAlwaysSucceeds = async () => {
    if (lucid) {
      const walletDetails = lucid.utils.getAddressDetails(await lucid.wallet.address(),);
      const AlwaysSucceedsScript : SpendingValidator = {
        type: "PlutusV2",
        script: alwaysSucceeds,
      }
      const alwaysSucceedsScriptAddr = lucid.utils.validatorToAddress(AlwaysSucceedsScript);

      const utxos = (await lucid.utxosAt(alwaysSucceedsScriptAddr))
      const tx = await lucid.newTx()
        .collectFrom([utxos[0]])
        .complete();

      const txSigned = await tx.sign().complete();
      const txHash = await txSigned.submit()
    }
  }

  const lockVestingUtxo = async () => {
    if (lucid) {
      const vestingValidator : SpendingValidator = {type: "PlutusV1", script: "5907945907910100003233223232323232323232323232323322323232323222232325335332232333573466e1c005"}
      
      const receiving_addr : string = await lucid.wallet.address()
      const {paymentCredential} = lucid.utils.getAddressDetails(receiving_addr)

      const vestingAddress : Address = lucid.utils.validatorToAddress(vestingValidator)
      // data VestingDatum = VestingDatum {beneficiary :: PubKeyHash, deadline :: POSIXTime}
      const vestingDatum = new Constr (0, [new Constr (0, [paymentCredential?.hash!]), new Constr(0, [BigInt(Date.now() + 2628000000)])])

      const tx = await lucid.newTx()
        .payToContract(vestingAddress, Data.to(vestingDatum), {lovelace: BigInt(5_000_000)})
        .complete()
      
      const signedTx = await tx.sign().complete();
      
      const txHash = await signedTx.submit();
    }
  }


  const redeemVestingUtxo = async () => {
    if(lucid){
      const vestingValidator : SpendingValidator = {type: "PlutusV1", script: "5907945907910100003233223232323232323232323232323322323232323222232325335332232333573466e1c005"}
      const vestingAddress : Address = lucid.utils.validatorToAddress(vestingValidator)
      const redeemer = Data.void() // Data.void()
      const {paymentCredential} = lucid.utils.getAddressDetails(await lucid.wallet.address());
      const utxos = (await lucid.utxosAt(vestingAddress))
 
      let utxo : UTxO, utxoDatum, datumFields;

      for(let i = 0; i < utxos.length; i++){
        utxo = utxos[i];
        if(utxo.datumHash && !utxo.datum){
          utxo.datum = await lucid.datumOf(utxo);
        }
        utxoDatum = Data.toJson(Data.from(utxo.datum!));
        datumFields = {
          beneficiary: utxoDatum.fields[0],
          deadline: utxoDatum.fields[1]
        }
        
        if (datumFields.beneficiary == paymentCredential?.hash!) {
          console.log("Found your vested UTXO");
          const tx = await lucid.newTx()
          .collectFrom([utxo!], redeemer)
          .attachSpendingValidator(vestingValidator)
          .addSignerKey(paymentCredential?.hash!)
          .validFrom(Date.now())
          .complete()

          const signedTx = await tx.sign().complete()
          const txHash = await signedTx.submit()

          break;
        }
      }
    }
  }

  const lockUtxo = async () => {
    if (lucid) {
      const receiving_addr : string = "addr_test1qryc5tck5kqqs3arcqnl4lplvw5yg2ujsdnhx5eawn9lyzzvpmpraw365fayhrtpzpl4nulq6f9hhdkh4cdyh0tgnjxsg03qnh"
      
      const tx = await lucid.newTx()
        .payToAddress(receiving_addr, { lovelace: BigInt(2000000) })
        .validFrom(Date.now() + 100000)
        .validTo(Date.now() + 100000)
        .complete();
      
      const signedTx = await tx.sign().complete();
      
      const txHash = await signedTx.submit();
    }
  }

  const redeemUtxo = async () => {
    if (lucid) {
    console.log("Implement TODO"); 
    }
  }

  // data ToyRedeemer = ToyRedeemer{key :: Integer}
  const toyScriptCbor = "59079959079601000033232323232323232323232323232332232323232222322323253353330073333573466e1cd55ce9baa0064800080648c98c8064cd5ce00d00c80b9999ab9a3370e6aae75401120002375a6ae84d55cf280291931900c99ab9c01a0190173333573466e1cd55cea8012400046644246600200600464646464646464646464646666ae68cdc39aab9d500a480008cccccccccc888888888848cccccccccc00402c02802402001c01801401000c008cd40548c8c8cccd5cd19b8735573aa004900011991091980080180118101aba15002301a357426ae8940088c98c80a4cd5ce01501481389aab9e5001137540026ae854028cd4054058d5d0a804999aa80c3ae501735742a010666aa030eb9405cd5d0a80399a80a8101aba15006335015335502302175a6ae854014c8c8c8cccd5cd19b8735573aa00490001199109198008018011919191999ab9a3370e6aae754009200023322123300100300233502675a6ae854008c09cd5d09aba2500223263202d33573805c05a05626aae7940044dd50009aba150023232323333573466e1cd55cea8012400046644246600200600466a04ceb4d5d0a80118139aba135744a004464c6405a66ae700b80b40ac4d55cf280089baa001357426ae8940088c98c80a4cd5ce01501481389aab9e5001137540026ae854010cd4055d71aba15003335015335502375c40026ae854008c074d5d09aba2500223263202533573804c04a04626ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226aae7940044dd50009aba150023232323333573466e1d400520062321222230040053018357426aae79400c8cccd5cd19b875002480108c848888c008014c068d5d09aab9e500423333573466e1d400d20022321222230010053016357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6404066ae7008408007807407006c4d55cea80089baa001357426ae8940088c98c8064cd5ce00d00c80b880c09931900c19ab9c4910350543500018135573ca00226ea80044dd50008919118011bac001320013550142233335573e0024a012466a01060086ae84008c00cd5d100100991919191999ab9a3370e6aae75400d20002333222123330010040030023232323333573466e1cd55cea80124000466442466002006004602a6ae854008cd4038050d5d09aba2500223263201833573803203002c26aae7940044dd50009aba150033335500775ca00c6ae854008cd4029d71aba135744a004464c6402866ae700540500484d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355012223233335573e0044a010466a00e66aa02a600c6aae754008c014d55cf280118021aba200301213574200222440042442446600200800624464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900819ab9c01101000e00d135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900699ab9c00e00d00b135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c802ccd5ce00600580489baa00112232323333573466e1d400520042122200123333573466e1d40092002232122230030043006357426aae7940108cccd5cd19b87500348000848880088c98c8038cd5ce00780700600580509aab9d5001137540024646666ae68cdc3a800a4004424400446666ae68cdc3a801240004244002464c6401466ae7002c02802001c4d55ce9baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c8048cd5ce00980900800780700680600580509aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401666ae7003002c0240204d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200833573801201000c00a26aae7540044dd50008891119191999ab9a3370e6aae75400920002335500a300635742a004600a6ae84d5d1280111931900419ab9c009008006135573ca00226ea800526120014910350543100112212330010030021123230010012233003300200200133222225335333573466e1c0092056005004100513357389212177726f6e672067756573732c20796f7520617265206f7574206f66206c75636b21000041220021220011"
  const toyScript : SpendingValidator = {
    type: "PlutusV1",
    script: toyScriptCbor
  }

  const lockGuess = async() => {
    if(lucid){
      const toyScriptAddress = lucid.utils.validatorToAddress(toyScript)
      const tx = await lucid.newTx() 
        .payToContract(toyScriptAddress, Data.void(), {lovelace: BigInt(1_000_000)} )
        .complete()
      const signed = await tx.sign().complete()
      await signed.submit()
    }
  }
  // data ToyRedeemer = ToyRedeemer{key :: Integer}
  const unlockGuess = async () => {
    if (lucid){
      const toyScriptAddress = lucid.utils.validatorToAddress(toyScript)  
      const scriptUTxOs = (await lucid.utxosAt(toyScriptAddress))

      if(scriptUTxOs.length == 0){throw new Error("no utxos found at toy script")}

      const redeemer = new Constr(0, [BigInt(43)])
      
      const tx = await lucid.newTx()
        .collectFrom([scriptUTxOs[0]], Data.to(redeemer))
        .attachSpendingValidator(toyScript)
        .complete()

      const signedTx = await tx.sign().complete()
      await signedTx.submit()
    }
  }

  return (
    <div className="px-10">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Cardano</Link>
        </div>
        <div className="flex-none">
          <WalletConnect />
        </div>
      </div>
      <div>Address: {walletStore.address}</div>
      <div className='m-10'>
        <p> 
          Emurgo example
        </p>
      </div>
      <div className="mx-60 my-10">
        <button className="btn btn-primary m-5" onClick={() => { lockParamsTest() }} >Deposit</button>
        <button className="btn btn-secondary m-5" onClick={() => { unlockParamsTest() }}>Unlock</button>
        <button className="btn btn-secondary m-5" onClick={() => { mintFT() }}> Mint FT</button>
        <button className="btn btn-secondary m-5" onClick={() => { unlockGuess() }}>Unlock Guess</button>
        <button className="btn btn-secondary m-5" onClick={() => { deploySequentialMint("Boo") }}>Deploy Sequential Mint</button>
        <button className="btn btn-secondary m-5" onClick={() => { getOffers(paymentCredentialOf(walletStore.address)) }}>Unlock Guess</button>
      </div>
    </div>
  )
}

export default Helios
