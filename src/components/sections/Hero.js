import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {SectionProps} from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify"
import {ERC20_ADDRESS} from "../../contracts/MainToken"
import {useWeb3} from "../../contexts/Web3Context"
import {FLOWER_SHOP_ADDRESS} from "../../contracts/FlowerShop"
import Input from "../elements/Input"
import {utils} from "web3";
import Modal from 'react-modal';
import {Spinner} from "react-bootstrap";

const propTypes = {
    ...SectionProps.types
}

const defaultProps = {
    ...SectionProps.defaults
}

const Hero = ({
                  className,
                  topOuterDivider,
                  bottomOuterDivider,
                  topDivider,
                  bottomDivider,
                  hasBgColor,
                  invertColor,
                  ...props
              }) => {

    const [tokenName, setTokenName] = useState('');
    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [flowerPrice, setFlowerPrice] = useState('-');
    const [inventory, setInventory] = useState('-');
    const [amount, setAmount] = useState(1);
    const [buying, setBuying] = useState(false);
    const {web3, login, data} = useWeb3();
    const {tokenContract, shopContract, exploreUrl} = data;

    useEffect(() => {
        try {
            if (tokenContract) {
                tokenContract.methods.symbol().call().then((tn) => {
                    console.log('tn', tn);
                    setTokenName(tn);
                });
            }
        } catch (e) {
            console.error('Get token contract name error', e)
        }
    }, [tokenContract]);

    const {t, i18n} = useTranslation();
    const outerClasses = classNames(
        'hero section center-content',
        topOuterDivider && 'has-top-divider',
        bottomOuterDivider && 'has-bottom-divider',
        hasBgColor && 'has-bg-color',
        invertColor && 'invert-color',
        className
    );

    const innerClasses = classNames(
        'hero-inner section-inner',
        topDivider && 'has-top-divider',
        bottomDivider && 'has-bottom-divider'
    );

    let totalPrice, price = 0;
    if (flowerPrice) {
        price = parseInt(flowerPrice) * (Math.pow(10, -18));
        totalPrice = amount * price;
    }

    return (
        <section
            {...props}
            className={outerClasses}
        >
            <div className="container-sm">
                <div className={innerClasses}>
                    <div className="hero-content">
                        <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
                            {t('BASIC.HOME_HEADER')} <span className="text-color-primary">{t('BASIC.BLUEBELL')}</span>
                        </h1>
                        <div className="container-xs">
                            <div className="mb-16 reveal-from-bottom" data-reveal-delay="400">
                                {t('BASIC.HOME_DESCRIPTION')}
                            </div>
                            <div className="reveal-from-bottom" data-reveal-delay="600">
                                <ButtonGroup>
                                    <Button color="primary" wideMobile onClick={async () => {
                                        const fp = await shopContract.methods.flowerPrice(utils.asciiToHex(tokenName)).call()
                                        setFlowerPrice(fp)
                                        const fi = await tokenContract.methods.balanceOf(FLOWER_SHOP_ADDRESS).call();
                                        setInventory(fi)
                                        setBuyModalOpen(true)
                                        console.log('setBuyModalOpen')
                                    }}>{t('BASIC.GET_COINS')}</Button>
                                    <Modal isOpen={buyModalOpen} onRequestClose={() => setBuyModalOpen(false)}>
                                        <div style={{display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'}}>
                                            <div className="text-color-primary mb-16" style={{fontSize: 32, fontWeight: 'bold'}}>
                                                {t('BASIC.BUY_BLUEBELL')}
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
                                            <Button color="primary"
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
                                                            console.log('buy result', result);
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
                                    <Button tag="a" color="dark" wideMobile
                                            href={`${exploreUrl}/token/${ERC20_ADDRESS}`}
                                            target={'_blank'}>
                                        {t('BASIC.VIEW_ON_EXPLORE')}
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                    <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px"
                         data-reveal-delay="800">
                        <Image
                            className="has-shadow"
                            src={require('./../../assets/images/home.jpg')}
                            alt="Hero"/>
                    </div>
                </div>
            </div>
        </section>
    );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
