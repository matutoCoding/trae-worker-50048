import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { FuneralStyle } from '@/types';

interface StyleCardProps {
  style: FuneralStyle;
  showCartBtn?: boolean;
  onAddCart?: (style: FuneralStyle) => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, showCartBtn = true, onAddCart }) => {
  return (
    <View
      className={styles.styleCard}
      onClick={() => {
        Taro.navigateTo({
          url: `/pages/style-detail/index?id=${style.id}`
        });
      }}
    >
      <View className={styles.imageWrap}>
        <Image
          src={style.images[0]}
          className={styles.image}
          mode="aspectFill"
        />
        {(style.isHot || style.isNew) && (
          <View className={styles.badgeWrap}>
            {style.isHot && <View className={classnames(styles.badge, styles.hotBadge)}>热销</View>}
            {style.isNew && <View className={classnames(styles.badge, styles.newBadge)}>新品</View>}
          </View>
        )}
      </View>

      <View className={styles.content}>
        <Text className={styles.name}>{style.name}</Text>
        <Text className={styles.desc}>{style.description}</Text>
        <View className={styles.meta}>
          <Text className={styles.makeTime}>扎制约{style.makeTime}</Text>
        </View>
      </View>

      <View className={styles.bottom}>
        <View>
          <Text className={styles.price}>¥{style.price}</Text>
          {style.originalPrice && (
            <Text className={styles.originalPrice}>¥{style.originalPrice}</Text>
          )}
        </View>
        {showCartBtn && (
          <Button
            className={styles.cartBtn}
            onClick={(e) => {
              e.stopPropagation();
              onAddCart?.(style);
            }}
          >
            选择
          </Button>
        )}
      </View>
    </View>
  );
};

export default StyleCard;
