import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import ShopItem from "./ShopItem";
import {BERRY_BELL_ADDRESS, ERC20_ADDRESS, NAVY_BELL_ADDRESS} from "../../contracts/ERC20Token";

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const ShopList = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Natural BlueBell',
    paragraph: 'You can purchase three different kinds of natural bluebell here'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <ShopItem name={'Classic Bluebell'}
                      address={ERC20_ADDRESS}
                      color={'#79B2FF'}
                      details={'The most common Bluebell kind. It maybe regarded as the UK favourite flower!?'}
                      delay={'200'}
                      image={require('../../assets/images/logo.svg')}
            />
            <ShopItem name={'Berry Bluebell'}
                      address={BERRY_BELL_ADDRESS}
                      color={'#616BC6'}
                      details={'Another common kind of Bluebell. Some people said it smells like blueberry!?'}
                      delay={'400'}
                      image={require('../../assets/images/berry-bell.svg')}
            />
            <ShopItem name={'Navy Bluebell'}
                      address={NAVY_BELL_ADDRESS}
                      color={'#23395D'}
                      details={'The common dark kind Bluebell. Maybe you can found it on the warship!?'}
                      delay={'600'}
                      image={require('../../assets/images/navy-bell.svg')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

ShopList.propTypes = propTypes;
ShopList.defaultProps = defaultProps;

export default ShopList;