import React, {useContext, useEffect, useState} from 'react'
import Web3 from "web3"
import {toast} from "react-toastify"
import {useTranslation} from "react-i18next"
import {FLOWER_SHOP_ABI, FLOWER_SHOP_ADDRESS} from "../contracts/FlowerShop"
import {ERC20_ABI, ERC20_ADDRESS} from "../contracts/ERC20Token"

const Web3Context = React.createContext({web3: null});

const initialData = {web3: null, account: '', chainId: -1, exploreUrl: '', shopContract: null, tokenContract: null};

export const Web3ContextProvider = ({children}) => {
    const [data, setData] = useState(initialData);
    const {t, i18n} = useTranslation();
    useEffect(() => {
        let exploreUrl = 'https://testnet.bscscan.com'
        if(process.env.REACT_APP_CONTRACT_ENV === 'mainnet'){
            exploreUrl = 'https://bscscan.com'
        }
        const web3Instance = new Web3(Web3.givenProvider)
        const shopContract = new web3Instance.eth.Contract(FLOWER_SHOP_ABI, FLOWER_SHOP_ADDRESS);
        // const tokenContract = new web3Instance.eth.Contract(ERC20_ABI, ERC20_ADDRESS);
        setData({
            ...data,
            web3: web3Instance,
            shopContract,
            // tokenContract,
            exploreUrl,
        })
    }, [])

    const tokenContract = (tokenAddress) => {
        if(tokenAddress){
            const web3Instance = new Web3(Web3.givenProvider)
            return new web3Instance.eth.Contract(ERC20_ABI, tokenAddress);
        }
        return null;
    }

    const login = async () => {
        try {
            const accounts = await data.web3.eth.requestAccounts();
            const chainId = await data.web3.eth.getChainId();
            if (chainId === 56 || chainId === 97) {
                const updated = {...data, account: accounts[0], chainId}
                setData({...data, account: accounts[0], chainId})
                return updated
            }
            throw new Error('INVALID_CHAIN_ID');
        } catch (e) {
            console.error('login error', e);
            toast.error(t('BASIC.LOGIN_FAIL'), {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setData(initialData);
        }
        return {}
    }

    return <Web3Context.Provider value={{login, tokenContract, data}}>
        {children}
    </Web3Context.Provider>
}

export const useWeb3 = () => useContext(Web3Context);
