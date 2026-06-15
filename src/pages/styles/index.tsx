import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import styles from './index.module.scss';
import StyleCard from '@/components/StyleCard';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { funeralStyles, categoryNames } from '@/data/styles';
import { FuneralStyle, StyleCategory } from '@/types';

const CATEGORY_TABS: { key: StyleCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'wreath', label: '花圈' },
  { key: 'basket', label: '花篮' },
  { key: 'stand', label: '立式花牌' },
  { key: 'bouquet', label: '花束' },
  { key: 'arrangement', label: '布置套装' }
];

const StylesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  usePullDownRefresh(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const hotStyles = useMemo(() =>
    funeralStyles.filter(s => s.isHot).slice(0, 5),
    []
  );

  const filteredStyles = useMemo(() => {
    if (activeCategory === 'all') return funeralStyles;
    return funeralStyles.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const handleAddCart = (style: FuneralStyle) => {
    console.log('[Styles] handleAddCart', { styleId: style.id, name: style.name });
    Taro.showToast({ title: `已选择:${style.name}`, icon: 'none' });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
      }}
    >
      <View className={styles.searchBar}>
        <Text className={styles.title}>款式库</Text>
        <View
          className={styles.searchInput}
          onClick={() => Taro.showToast({ title: '搜索功能', icon: 'none' })}
        >
          <Text className={styles.searchIcon}>⌕</Text>
          <Text className={styles.inputPlaceholder}>搜索花圈、花篮、花束...</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.categoryTabs}>
          {CATEGORY_TABS.map(tab => (
            <View
              key={tab.key}
              className={`${styles.categoryTab} ${activeCategory === tab.key ? styles.active : ''}`}
              onClick={() => setActiveCategory(tab.key)}
            >
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>

        {activeCategory === 'all' && hotStyles.length > 0 && (
          <View className={styles.hotSection}>
            <SectionHeader title="热销推荐" />
            <ScrollView scrollX className={styles.hotScroll}>
              {hotStyles.map(style => (
                <View
                  key={style.id}
                  className={styles.hotCard}
                  onClick={() => Taro.navigateTo({
                    url: `/pages/style-detail/index?id=${style.id}`
                  })}
                >
                  <Image
                    src={style.images[0]}
                    className={styles.hotImage}
                    mode="aspectFill"
                  />
                  <View className={styles.hotContent}>
                    <Text className={styles.hotName}>{style.name}</Text>
                    <Text className={styles.hotDesc}>{style.suitable}</Text>
                    <Text className={styles.hotPrice}>¥{style.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <SectionHeader
          title={activeCategory === 'all' ? '全部款式' : categoryNames[activeCategory]}
          actionText={`共${filteredStyles.length}款`}
        />

        {filteredStyles.length === 0 ? (
          <EmptyState text="该分类暂无款式" />
        ) : (
          <View className={styles.grid}>
            {filteredStyles.map(style => (
              <StyleCard
                key={style.id}
                style={style}
                onAddCart={handleAddCart}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default StylesPage;
