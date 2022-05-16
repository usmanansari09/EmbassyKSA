import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  I18nManager,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale} from 'react-native-size-matters';
import logo from '../../assets/logo.png';
import {Button, ActivityIndicator} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKeys} from '../../services/storage';
import RNRestart from 'react-native-restart';
import i18n from '../../config/i18n';
import {showMessage} from 'react-native-flash-message';
const logoSize = moderateScale(260);
const SelectLanuage = props => {
  const [loading, setLoading] = React.useState(true);
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    const onStart = async () => {
      try {
        const lang = await AsyncStorage.getItem(storageKeys.lang);
        if (lang !== null) {
          await i18n.changeLanguage(lang);
          await AsyncStorage.removeItem(storageKeys.lang);
          I18nManager.forceRTL(false);
          navigation.navigate('UserInfo');
          setLoading(false);
        } else setLoading(false);
      } catch (error) {
        console.log({error});
        showMessage({
          type: 'danger',
          message: 'Something went wrong. Try again.',
        });
      }
    };
    onStart();
  }, []);
  const langButtonStyling = React.useMemo(() => {
    const height = moderateScale(42);
    const width = moderateScale(140);
    return {
      style: {
        backgroundColor: colors.background,
        width,
        height,
        borderRadius: width / 2,
      },
      contentStyle: {
        height,
      },
      labelStyle: {color: colors.primary, fontSize: moderateScale(14)},
    };
  }, []);
  const onProceed = async (language, isRTL = false) => {
    try {
      if (isRTL) I18nManager.forceRTL(true);
      else I18nManager.forceRTL(false);
      await AsyncStorage.setItem(storageKeys.lang, language);
      RNRestart.Restart();
    } catch (error) {
      console.log({error});
      showMessage({
        type: 'danger',
        message: 'Something went wrong. Try again.',
      });
    }
  };
  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.primary}]}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top ? 0 : moderateScale(15),
      }}>
      {loading ? (
        <ActivityIndicator
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          animating={true}
          color={colors.background}
          size={moderateScale(40)}
        />
      ) : (
        <SafeAreaView style={styles.safeContainer}>
          <View style={styles.orgContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.name, {color: colors.secondary}]}>
              {t('welcome:text_embassy')}
            </Text>
            <View style={styles.languageContainer}>
              <Button
                uppercase
                mode="contained"
                style={langButtonStyling.style}
                contentStyle={langButtonStyling.contentStyle}
                labelStyle={langButtonStyling.labelStyle}
                onPress={() => onProceed('en')}>
                English
              </Button>
              <Button
                uppercase
                mode="contained"
                style={[
                  langButtonStyling.style,
                  {marginLeft: moderateScale(10)},
                ]}
                contentStyle={langButtonStyling.contentStyle}
                labelStyle={langButtonStyling.labelStyle}
                onPress={() => onProceed('ur', true)}>
                اردو
              </Button>
            </View>
          </View>
          <Text
            style={[
              styles.poweredText,
              {
                color: colors.secondary,
                marginVertical: insets.bottom ? 0 : moderateScale(15),
              },
            ]}>
            {t('common:text_powered')}
          </Text>
        </SafeAreaView>
      )}
    </ScrollView>
  );
};
export default SelectLanuage;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {flexGrow: 1, justifyContent: 'space-between'},
  orgContainer: {
    alignItems: 'center',
    marginTop: moderateScale(45),
  },
  logo: {
    width: logoSize,
    height: logoSize,
  },
  name: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginTop: moderateScale(42),
    textAlign: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: moderateScale(155),
  },
  poweredText: {
    fontSize: moderateScale(15),
    textAlign: 'center',
  },
});
