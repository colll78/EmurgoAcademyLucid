import { Blockfrost, Lucid } from 'lucid-cardano';

const initLucid = async (wallet: string) => {
    const api = (await window.cardano[
        wallet.toLowerCase()
    ].enable())

    // const nami = await window.cardano.nami.enable();
    // const eternl = window.cardano.eternl.enable();
    // const gero = await window.cardano.gero.enable();
    
    const lucid = await Lucid.new(
        new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', "preprodLT9nUTb22P26FiVH42jSFJU2IZaNxZVz") //process.env.NEXT_PUBLIC_BLOCKFROST as string),
        ,'Preprod')
    // const lucid = await Lucid.new(
    //         new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', "mainneto2wd71NAi5sZMWDHUTXxgvMTEC6ciS2I") //process.env.NEXT_PUBLIC_BLOCKFROST as string),
    //         ,'Mainnet')
    lucid.selectWallet(api)
    //setLucid(lucid)
    return lucid;
}


export default initLucid;