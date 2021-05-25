import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import {SectionProps} from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import {useTranslation} from "react-i18next";
import {ERC20_ADDRESS} from "../../contracts/ERC20Token"
import {useWeb3} from "../../contexts/Web3Context"

import {Link} from "react-router-dom";

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

    const {data} = useWeb3();
    const {exploreUrl} = data;

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
                                        <Button color="primary" wideMobile>
                                            <Link to={'/shop'}>
                                                {t('BASIC.GET_COINS')}
                                            </Link>
                                        </Button>
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
