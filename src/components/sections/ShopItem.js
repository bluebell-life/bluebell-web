import Modal from "react-modal";
import Input from "../elements/Input";
import Button from "../elements/Button";
import {utils} from "web3";
import {toast} from "react-toastify";
import {Spinner} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useWeb3} from "../../contexts/Web3Context";
import Image from "../elements/Image";
import {FLOWER_SHOP_ADDRESS} from "../../contracts/FlowerShop";
import {useTranslation} from "react-i18next";

const ShopItem = ({name, details, color, address, image, animation, delay}) => {
    const animationDirection = animation || 'right';
    const animationDelay = delay || '0';

    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [flowerPrice, setFlowerPrice] = useState('-');
    const [inventory, setInventory] = useState('-');
    const [amount, setAmount] = useState(1);
    const [buying, setBuying] = useState(false);
    const {web3, login, tokenContract, data} = useWeb3();
    const {shopContract} = data;
    const [tokenName, setTokenName] = useState('');
    const {t} = useTranslation();
    useEffect(() => {
        try {
            const contract = tokenContract(address)
            console.log('contract', contract)
            if(contract){
                contract.methods.symbol().call().then((tn) => {
                    console.log('tn', tn, address)
                    setTokenName(tn);
                });
            }
        } catch (e) {
            console.error('Get token contract name error', e)
        }
    }, [address])
    let totalPrice, price = 0;
    if (flowerPrice) {
        price = parseInt(flowerPrice) * (Math.pow(10, -18));
        totalPrice = amount * price;
    }

    return  <div className={`tiles-item reveal-from-${animationDirection}`} data-reveal-delay={animationDelay}>
        <div className="tiles-item-inner">
            <div className="testimonial-item-content">
                <div className="display-f align-center">
                    <Image
                        src={image}
                        width={64}
                        height={64} />
                    <div className="text-sm mt-16 mb-0">
                        {color}
                    </div>
                    <p className="text-sm mt-16 mb-0">
                        {details}
                    </p>
                </div>
            </div>
            <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                <span className="testimonial-item-name text-color-high">{name}</span>
                <span className="text-color-low"> / </span>
                <span className="cursor-pointer" onClick={async () => {
                    const fp = await shopContract.methods.flowerPrice(utils.asciiToHex(tokenName)).call()
                    setFlowerPrice(fp)
                    const contract = tokenContract(address)
                    const fi = await contract.methods.balanceOf(FLOWER_SHOP_ADDRESS).call();
                    setInventory(fi)
                    setBuyModalOpen(true)
                }}>{t('BASIC.BUY')} {tokenName}</span>
            </div>
        </div>
        <Modal isOpen={buyModalOpen} onRequestClose={() => setBuyModalOpen(false)}>
            <div style={{display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'}}>
                <div className="text-color-primary mb-16" style={{fontSize: 32, fontWeight: 'bold', color}}>
                    {t('BASIC.BUY')} {tokenName}
                </div>
                <div className="mb-16">
                    <div className="mb-16">{`${t('BASIC.REMAINING_INVENTORY')}: ${inventory} ${tokenName}`}</div>
                    <div className="mb-16">{`${t('BASIC.PRICE')}: ${price || '-'} BNB`}</div>
                    <div className="mb-16" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <span style={{marginRight: 8}}>{`${t('BASIC.QUANTITY')}:`}</span>
                        <Input value={amount.toString()}
                               onChange={(e) => setAmount(e.target.value)}/>
                    </div>
                    <div className="mb-16">{`${t('BASIC.TOTAL')}: ${totalPrice || '-'} BNB`}</div>
                </div>
                <Button style={{backgroundColor: color, color: '#fff'}}
                        wideMobile
                        disabled={buying || isNaN(totalPrice) || !totalPrice}
                        onClick={async () => {
                            const {account} = await login();
                            await tokenContract.methods
                            setBuying(true)
                            try{
                                const result = await shopContract.methods.buy(utils.asciiToHex(tokenName), amount).send({
                                    from: account,
                                    value: amount * flowerPrice
                                })
                                if (result && result.status) {
                                    toast.success(t('BASIC.BUY_SUCCESS'), {
                                        position: "top-center",
                                        autoClose: 4000,
                                        hideProgressBar: true,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                    });
                                    setBuying(false);
                                    setBuyModalOpen(false);
                                    return
                                }
                            }
                            catch (e){
                                console.error('buy token error', e);
                            }
                            toast.error(t('BASIC.BUY_FAIL'), {
                                position: "top-center",
                                autoClose: 4000,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            setBuying(false);
                            setBuyModalOpen(false);
                        }}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <span>{t('BASIC.BUY')}</span>
                        {
                            buying && <Spinner
                                style={{marginLeft: 4}}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        }
                    </div>
                </Button>
            </div>
        </Modal>
    </div>
}

export default ShopItem