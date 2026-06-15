import React, { useState } from 'react';
import { View, Text, Button, Textarea, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

type FontStyle = 'standard' | 'elegant' | 'solemn';

const COUPLET_TEMPLATES = [
  { upper: '美德长存典范永在', lower: '音容宛在风范犹存', horizontal: '永垂不朽' },
  { upper: '一生行好事', lower: '千古流芳名', horizontal: '风范长存' },
  { upper: '寿高德劭', lower: '松青柏翠', horizontal: '德高望重' },
  { upper: '流芳百世', lower: '遗爱千秋', horizontal: '名垂青史' }
];

const FONT_OPTIONS: { key: FontStyle; label: string; sample: string }[] = [
  { key: 'standard', label: '标准体', sample: '挽联' },
  { key: 'elegant', label: '楷体', sample: '挽联' },
  { key: 'solemn', label: '黑体庄重', sample: '挽联' }
];

const CoupletPage: React.FC = () => {
  const [upper, setUpper] = useState('美德长存典范永在');
  const [lower, setLower] = useState('音容宛在风范犹存');
  const [horizontal, setHorizontal] = useState('永垂不朽');
  const [decedentsName, setDecedentsName] = useState('王老先生');
  const [senderName, setSenderName] = useState('李明');
  const [senderRelation, setSenderRelation] = useState('外甥');
  const [fontStyle, setFontStyle] = useState<FontStyle>('solemn');

  const handleUseTemplate = (tpl: typeof COUPLET_TEMPLATES[number]) => {
    console.log('[Couplet] handleUseTemplate', { tpl });
    setUpper(tpl.upper);
    setLower(tpl.lower);
    setHorizontal(tpl.horizontal);
    Taro.showToast({ title: '已应用模板', icon: 'success' });
  };

  const handleSave = () => {
    console.log('[Couplet] handleSave', {
      upper, lower, horizontal, decedentsName, senderName, senderRelation, fontStyle
    });

    if (!upper.trim() || !lower.trim()) {
      Taro.showToast({ title: '请填写上下联', icon: 'none' });
      return;
    }
    if (!decedentsName.trim()) {
      Taro.showToast({ title: '请填写逝者姓名', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '保存中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showModal({
        title: '挽联定制完成',
        content: `上联：${upper}\n下联：${lower}\n逝者：${decedentsName}`,
        showCancel: false,
        confirmColor: '#2D5A4B',
        success: () => {
          Taro.navigateBack();
        }
      });
    }, 800);
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认退出？',
      content: '未保存的内容将会丢失',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.previewCard}>
          <Text className={styles.previewTitle}>挽联预览效果</Text>

          {horizontal && (
            <View style={{ display: 'flex', justifyContent: 'center', marginBottom: '32rpx' }}>
              <View className={styles.horizontalScroll}>
                <Text className={styles.horizontalText}>{horizontal}</Text>
              </View>
            </View>
          )}

          <View className={styles.coupletFrame}>
            <View className={classnames(styles.scrollVertical, styles.scrollLeft)}>
              <Text className={styles.scrollText}>{upper}</Text>
            </View>
            <View className={classnames(styles.scrollVertical, styles.scrollRight)}>
              <Text className={styles.scrollText}>{lower}</Text>
            </View>
          </View>

          <View className={styles.decedentInfo}>
            <Text className={styles.decedentName}>
              {decedentsName || '逝者姓名'}
            </Text>
            <Text className={styles.senderInfo}>
              {senderRelation ? `${senderRelation} ` : ''}
              {senderName || '敬献者'} 敬挽
            </Text>
          </View>
        </View>

        <View className={styles.formCard}>
          <View className={styles.formTitle}>
            <View className={styles.titleBar}></View>
            <Text>挽联内容</Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              <Text className={styles.labelRequired}>*</Text>上联（右侧）
            </Text>
            <View className={styles.inputWrap}>
              <Textarea
                className={styles.textareaInput}
                value={upper}
                onInput={(e) => setUpper(e.detail.value)}
                maxlength={16}
                placeholder="请输入上联内容"
                placeholderClass="ph-style"
              />
            </View>
            <Text className={styles.charCount}>{upper.length}/16</Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              <Text className={styles.labelRequired}>*</Text>下联（左侧）
            </Text>
            <View className={styles.inputWrap}>
              <Textarea
                className={styles.textareaInput}
                value={lower}
                onInput={(e) => setLower(e.detail.value)}
                maxlength={16}
                placeholder="请输入下联内容"
                placeholderClass="ph-style"
              />
            </View>
            <Text className={styles.charCount}>{lower.length}/16</Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>横批（可选）</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.textInput}
                value={horizontal}
                onInput={(e) => setHorizontal(e.detail.value)}
                maxlength={8}
                placeholder="请输入横批"
                placeholderClass="ph-style"
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <View className={styles.formTitle}>
            <View className={styles.titleBar}></View>
            <Text>逝者与敬献者信息</Text>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>
              <Text className={styles.labelRequired}>*</Text>逝者姓名/称谓
            </Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.textInput}
                value={decedentsName}
                onInput={(e) => setDecedentsName(e.detail.value)}
                maxlength={20}
                placeholder="如：王老先生、慈母XXX"
                placeholderClass="ph-style"
              />
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>敬献者称谓（可选）</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.textInput}
                value={senderRelation}
                onInput={(e) => setSenderRelation(e.detail.value)}
                maxlength={10}
                placeholder="如：外甥、挚友、同事"
                placeholderClass="ph-style"
              />
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>敬献者姓名</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.textInput}
                value={senderName}
                onInput={(e) => setSenderName(e.detail.value)}
                maxlength={30}
                placeholder="请输入敬献者姓名或单位"
                placeholderClass="ph-style"
              />
            </View>
          </View>
        </View>

        <View className={styles.formCard}>
          <View className={styles.formTitle}>
            <View className={styles.titleBar}></View>
            <Text>字体样式</Text>
          </View>

          <View className={styles.fontOptions}>
            {FONT_OPTIONS.map(opt => (
              <View
                key={opt.key}
                className={classnames(
                  styles.fontOption,
                  fontStyle === opt.key && styles.active
                )}
                onClick={() => setFontStyle(opt.key)}
              >
                <Text className={classnames(
                  styles.fontPreview,
                  opt.key === 'standard' && styles.fontStandard,
                  opt.key === 'elegant' && styles.fontElegant,
                  opt.key === 'solemn' && styles.fontSolemn
                )}>
                  {opt.sample}
                </Text>
                <Text className={styles.fontName}>{opt.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formCard}>
          <View className={styles.formTitle}>
            <View className={styles.titleBar}></View>
            <Text>常用挽联模板</Text>
          </View>

          <View className={styles.templates}>
            {COUPLET_TEMPLATES.map((tpl, idx) => (
              <View
                key={idx}
                className={styles.templateItem}
                onClick={() => handleUseTemplate(tpl)}
              >
                <Text className={styles.templateText}>
                  上：{tpl.upper}{'\n'}下：{tpl.lower}{'\n'}横：{tpl.horizontal}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.btnCancel} onClick={handleCancel}>取消</Button>
        <Button className={styles.btnSave} onClick={handleSave}>保存挽联</Button>
      </View>
    </View>
  );
};

export default CoupletPage;
