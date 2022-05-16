import React, {Component, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  I18nManager,
  TouchableOpacity,
  Keyboard,
  Appearance,
  Platform,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {TextInput} from 'react-native-paper';
import {moderateScale} from 'react-native-size-matters';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Avatar} from 'react-native-paper';
import {launchCamera} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {isEmpty, omit, pick} from 'lodash';
import {showMessage} from 'react-native-flash-message';
import validator from 'validator';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

const options = {
  mediaType: 'photo',
  maxWidth: 1500,
  maxHeight: 2100,
};
const formKeys = {
  PASSPORT_NUMBER: 'passport_no',
  NAME: 'name',
  FATHER_NAME: 'father_name',
  PHONE_NUMBER: 'phone',
  CNIC_NUMBER: 'cnic',
  EMAIL: 'email',
  PROVINCE: 'province',
  DISTRICT: 'disctrict',
  TEHSIL: 'tehsil',
  TOWN: 'town',
  VISA_TYPE: 'visa_type',
  IQAMA_NUMBER: 'iqama_no',
  PROFESSION: 'profession',
  BORDER_NO: 'border_no',
  KAFEEL_NAME: 'kafeel_name',
  KAFEEL_MOBILE_NO: 'kafeel_number',
  OEP_Registration_No: 'oep_number',
  OEP_NAME: 'oep_name',
  AMOUNT_PAID: 'amount_paid',
  WORK_START_DATE: 'work_start_date',
  CURRENT_WORK_STATUS: 'current_work_status',
  REGION: 'region',
  WORK_END_DATE: 'work_end_date',
  LEGAL_STATUS: 'legal_status',
  CNIC_PHOTO: 'attachment_cnic',
  PASSPORT_PHOTO: 'attachment_passport',
  IQAMA_PHOTO: 'attachment_iqama',
  PROBLEM_TYPE: 'problem_type',
  PROBLEM_DETAILS: 'problem_details',
};
const {
  PASSPORT_NUMBER,
  NAME,
  FATHER_NAME,
  PHONE_NUMBER,
  CNIC_NUMBER,
  EMAIL,
  PROVINCE,
  DISTRICT,
  TEHSIL,
  TOWN,
  VISA_TYPE,
  IQAMA_NUMBER,
  PROFESSION,
  BORDER_NO,
  KAFEEL_NAME,
  KAFEEL_MOBILE_NO,
  OEP_Registration_No,
  OEP_NAME,
  AMOUNT_PAID,
  WORK_START_DATE,
  CURRENT_WORK_STATUS,
  REGION,
  WORK_END_DATE,
  LEGAL_STATUS,
  CNIC_PHOTO,
  PASSPORT_PHOTO,
  IQAMA_PHOTO,
  PROBLEM_TYPE,
  PROBLEM_DETAILS,
} = formKeys;
const initialFormState = {
  [PASSPORT_NUMBER]: '',
  [NAME]: '',
  [FATHER_NAME]: '',
  [PHONE_NUMBER]: '',
  [CNIC_NUMBER]: '',
  [EMAIL]: '',
  [PROVINCE]: '',
  [DISTRICT]: '',
  [TEHSIL]: '',
  [TOWN]: '',
  [VISA_TYPE]: '',
  [IQAMA_NUMBER]: '',
  [PROFESSION]: '',
  [BORDER_NO]: '',
  [KAFEEL_NAME]: '',
  [KAFEEL_MOBILE_NO]: '',
  [OEP_Registration_No]: '',
  [OEP_NAME]: '',
  [AMOUNT_PAID]: '',
  [WORK_START_DATE]: '',
  [CURRENT_WORK_STATUS]: '',
  [REGION]: '',
  [WORK_END_DATE]: '',
  [LEGAL_STATUS]: '',
  [CNIC_PHOTO]: null,
  [PASSPORT_PHOTO]: null,
  [IQAMA_PHOTO]: null,
  [PROBLEM_TYPE]: '',
  [PROBLEM_DETAILS]: '',
};
const loaders = {
  VALIDATE: 'validate',
  SAVE: 'save',
};
const UserInfo = () => {
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   // document.title = `You clicked ${count} times`;
  //   setIsShow(true)
  // });
  const [form, setForm] = React.useState(initialFormState);
  const [openDrodown, setOpenDropdown] = React.useState();
  const [isShow, setIsShow] = React.useState(false);
  const [openDatePicker, setOpenDatePicker] = React.useState();
  const [citizenExists, setCitizenExists] = React.useState(false);
  const [loading, setLoading] = React.useState();
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const formStyling = React.useMemo(() => {
    const height = moderateScale(43);
    const fontSize = moderateScale(15);
    // const marginTop = moderateScale(15);
    const marginTop = moderateScale(18);
    const borderRadius = moderateScale(8);
    const paddingLeft = 12;
    const backgroundColor = colors.lightGrey;
    return {
      style: {
        height: height,
        fontSize: fontSize,
        backgroundColor: backgroundColor,
        color: colors.text,
        marginTop: marginTop - moderateScale(6),
        borderRadius: borderRadius,
      },
      fontSize,
      height,
      marginTop,
      backgroundColor,
      paddingLeft,
      borderRadius,
    };
  }, []);
  const dropdownProps = React.useMemo(() => {
    const dropdownListMode = 'MODAL';
    return {
      placeholderStyle: {
        color: colors.placeholder,
        fontSize: formStyling.fontSize,
      },
      listMode: dropdownListMode,
      style: {
        borderColor: colors.border,
        backgroundColor: formStyling.backgroundColor,
        paddingLeft: formStyling.paddingLeft,
        borderRadius: formStyling.borderRadius,
        height: formStyling.height,
      },
      containerStyle: {
        marginTop: formStyling.marginTop,
        height: formStyling.height,
      },
      labelStyle: {
        fontSize: formStyling.fontSize,
        color: colors.text,
      },
      listItemLabelStyle: {
        color: colors.text,
        fontSize: formStyling.fontSize,
      },
      modalContentContainerStyle: {
        paddingTop: insets.top ? insets.top : 10,
        paddingBottom: insets.bottom ? insets.bottom : 10,
        backgroundColor: colors.background,
      },
      rtl: I18nManager.isRTL,
    };
  }, []);
  const onChangeForm = (key, value) => {
    if (typeof value === 'string' && value.length > 20) return;
    const newForm = {...form};
    setForm({...newForm, [key]: value});
  };
  const openThatDropdown = name => {
    return openDrodown === name ? true : false;
  };
  const setOpenThatDropdownValue = (value, name) => {
    if (value === false) setOpenDropdown();
    else setOpenDropdown(name);
  };
  const getDateInString = date => {
    return moment(date).format('YYYY-MM-DD');
  };
  const onSelectImage = key => {
    var options = {quality: 0.5};
    launchCamera(options, response => {
      const {assets, errorCode, errorMessage} = response;
      if (assets) {
        const [image] = assets;
        const photo = {type: image.type, uri: image.uri, name: image.fileName};
        onChangeForm(key, photo);
      }
      if (errorCode || errorMessage) {
      }
    });
  };
  const validateField = (key, isReq = false) => {
    const field = form[key];
    const isString = typeof field === 'string';
    let error = null;
    let isEmptyField = isString ? isEmpty(field) : field === null;
    if (isEmptyField && isReq) {
      error = t('information:text_all_required');
    } else {
      switch (key) {
        case PASSPORT_NUMBER:
          if (field.length !== 9 && field.length < 9)
            throw new Error(t('information:text_enter_Valid_Passport'));
          break;
        case CNIC_NUMBER:
          if (field.length !== 13 && field.length < 13)
            throw new Error(t('information:text_enter_valid_cnic'));
          break;
        case IQAMA_NUMBER:
          if (
            field.length !== 10 &&
            field.length < 10 &&
            !validator.isNumeric(field, {no_symbols: true})
          )
            throw new Error(t('information:text_enter_valid_iqama'));
          break;
        case EMAIL:
          if (!validator.isEmail(field) && !isEmptyField)
            throw new Error(t('information:text_enter_valid_email'));
          break;
        case PHONE_NUMBER:
          if (field.length !== 10 && field.length < 10)
            throw new Error(t('information:text_enter_valid_number'));
          break;
        case BORDER_NO:
          if (field.length > 0 && field.length !== 10 && field.length < 10)
            throw new Error(t('information:text_enter_valid_border_no'));
          break;
        // case AMOUNT_PAID:
        //   const regex = /^\d+(\.\d{1,2})?$/;
        //   if (regex.test(field) && !isEmptyField)
        //     throw new Error('Enter Valid Amount Paid');
        //   break;
        default:
          break;
      }
    }
    return {error, field};
  };
  const onProceed = async () => {
    try {
      setLoading(loaders.SAVE);
      const sndForm = {};
      const reqFields = [
        'name',
        'father_name',
        'phone',
        'passport_no',
        'visa_type',
        'iqama_no',
      ];
      const reqAttachmentsFields = [
        'attachment_passport',
        'attachment_cnic',
        'attachment_iqama',
      ];
      const allReqFields = [...reqFields, 'attachment_passport'];

      const reqFormData = pick(form, allReqFields);
      for (let key in reqFormData) {
        const response = validateField(key, true);
        if (response.error) throw new Error(response.error);
        else sndForm[key] = response.field;
      }
      const optFormData = omit(form, reqFields);
      for (let key in optFormData) {
        const response = validateField(key);
        if (response.error) throw new Error(response.error);
        if (!isEmpty(optFormData[key])) sndForm[key] = response.field;
      }
      const attachements = pick(form, reqAttachmentsFields);
      for (let key in attachements) {
        if (!attachements[key]) continue;
        const formData = new FormData();
        formData.append(key, attachements[key]);
        const response = await axios.post(
          'https://pakinksa.azurewebsites.net/api/Citizen/Upload',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}},
        );
        if (isEmpty(response.data.Data)) throw new Error();
        else sndForm[key] = response.data.Data;
      }
      console.log('SEND FORM', sndForm);
      const response = await axios.post(
        'https://pakinksa.azurewebsites.net/api/Citizen/Save',
        sndForm,
      );
      if (response.data.Data) {
        showMessage({
          type: 'success',
          message: t('information:text_citizenSaved'),
        });
        setForm(initialFormState);
        setCitizenExists(false);
        setIsShow(false);
      }
    } catch (error) {
      showMessage({
        type: 'danger',
        message: error?.message ?? t('information:text_somethingwentwrong'),
      });
    } finally {
      setLoading();
    }
  };
  const onValidatePassportNumber = async () => {
    try {
      setLoading(loaders.VALIDATE);
      const passportNoField = validateField(PASSPORT_NUMBER);
      if (passportNoField.error) throw new Error(passportNoField.error);
      const response = await axios.get(
        'https://pakinksa.azurewebsites.net/api/Citizen/GetByPassport',
        {params: {passportno: form[PASSPORT_NUMBER]}},
      );
      if (response.data.Data === null) {
        setLoading();
        setCitizenExists(true);
        setIsShow(true);
        // console.log(response.data.Data);
        // if (response.data.Data) {
        //   setIsShow(true);
        // }
        Keyboard.dismiss();
      } else {
        showMessage({
          type: 'danger',
          message: t('information:text_citizenalreadyexit'),
        });
      }
    } catch (error) {
      console.log({error});
      showMessage({
        type: 'danger',
        message: error?.message ?? t('information:text_somethingwentwrong'),
      });
    } finally {
      setLoading();
    }
  };
  return (
    <View
      style={{flex: 1}}
      pointerEvents={loading === loaders.SAVE ? 'none' : 'auto'}>
      <KeyboardAwareScrollView
        style={[styles.container, {backgroundColor: colors.background}]}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: moderateScale(15) + insets.top,
          paddingHorizontal: moderateScale(10),
          paddingBottom: insets.bottom
            ? insets.bottom + moderateScale(15)
            : moderateScale(15),
        }}
        keyboardShouldPersistTaps="handled">
        <TextInput
          mode="outlined"
          style={[formStyling.style, {marginTop: 0}]}
          placeholder={t('information:text_passport_no')}
          placeholderTextColor={colors.placeholder}
          value={form[PASSPORT_NUMBER]}
          onChangeText={value => {
            if (value.length > 9) return;
            setCitizenExists(false);
            onChangeForm(PASSPORT_NUMBER, value);
          }}
        />
        <Button
          mode="contained"
          style={{
            height: moderateScale(45),
            marginTop: formStyling.marginTop,
            borderRadius: moderateScale(45) / 2,
          }}
          contentStyle={{height: moderateScale(45)}}
          labelStyle={{
            color: colors.background,
            fontSize: formStyling.fontSize,
          }}
          loading={loading === loaders.VALIDATE}
          disabled={citizenExists}
          onPress={onValidatePassportNumber}>
          {t('common:text_validate')}
        </Button>
        {isShow == true && (
          <View
            style={{width: '100%', opacity: citizenExists ? 1 : 0.8}}
            pointerEvents={citizenExists ? 'auto' : 'none'}>
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_name')}
              placeholderTextColor={colors.placeholder}
              value={form[NAME]}
              onChangeText={value => onChangeForm(NAME, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_father_name')}
              placeholderTextColor={colors.placeholder}
              value={form[FATHER_NAME]}
              onChangeText={value => onChangeForm(FATHER_NAME, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_phone')}
              placeholderTextColor={colors.placeholder}
              value={form[PHONE_NUMBER]}
              onChangeText={value => {
                if (value.length > 10) return;
                onChangeForm(PHONE_NUMBER, value);
              }}
              keyboardType="phone-pad"
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_cnic_no')}
              placeholderTextColor={colors.placeholder}
              value={form[CNIC_NUMBER]}
              onChangeText={value => {
                if (value.length > 13) return;
                onChangeForm(CNIC_NUMBER, value);
              }}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_email')}
              placeholderTextColor={colors.placeholder}
              value={form[EMAIL]}
              onChangeText={value => onChangeForm(EMAIL, value)}
              keyboardType="email-address"
            />

            {/* <DropDownPicker
        open={openThatDropdown(PROVINCE)}
        setOpen={value => setOpenThatDropdownValue(value, PROVINCE)}
        value={form[PROVINCE]}
        setValue={value => onChangeForm(PROVINCE, value())}
        items={[
          {label: 'Punjab', value: 'punjab'},
          {label: 'Balochistan', value: 'balochistan'},
          {label: 'Khyber Pakhtunkhwa', value: 'khyber pakhtunkhwa'},
          {label: 'Sindh', value: 'indh'},
        ]}
        placeholder={'Province'}
        {...dropdownProps}
      />
      <DropDownPicker
        open={openThatDropdown(DISTRICT)}
        setOpen={value => setOpenThatDropdownValue(value, DISTRICT)}
        value={form[DISTRICT]}
        setValue={value => onChangeForm(DISTRICT, value())}
        items={[
          {label: 'Lahore', value: 'lahore'},
          {label: 'Multan', value: 'multan'},
          {label: 'Rawalpindi', value: 'rawalpindi'},
          {label: 'Faisalabad', value: 'faisalabad'},
        ]}
        placeholder={'District'}
        {...dropdownProps}
      />
      <DropDownPicker
        open={openThatDropdown(TEHSIL)}
        setOpen={value => setOpenThatDropdownValue(value, TEHSIL)}
        value={form[TEHSIL]}
        setValue={value => onChangeForm(TEHSIL, value())}
        items={[
          {label: 'Kasur District', value: 'kasur district'},
          {label: 'Lahore District', value: 'lahore district'},
          {label: 'Sheikhupura District', value: 'sheikhupura district'},
          {label: 'Nankana Sahib Distric', value: 'nankana sahib district'},
        ]}
        placeholder={'Tehsil'}
        {...dropdownProps}
      />
      <TextInput
        mode="outlined"
        style={formStyling.style}
        placeholder={'Town'}
        placeholderTextColor={colors.placeholder}
        value={form[TOWN]}
        onChangeText={value => onChangeForm(TOWN, value)}
      /> */}
            <DropDownPicker
              open={openThatDropdown(VISA_TYPE)}
              setOpen={value => setOpenThatDropdownValue(value, VISA_TYPE)}
              value={form[VISA_TYPE]}
              setValue={value => onChangeForm(VISA_TYPE, value())}
              items={[
                {label: t('information:text_work_visa'), value: 'Work visa'},
                {label: t('information:text_visit_visa'), value: 'Visit visa'},
                {label: t('information:text_hajj_visa'), value: 'Hajj visa'},
                {label: t('information:text_umrah'), value: 'Umrah'},
                {
                  label: t('information:text_family_dependent'),
                  value: 'Family - dependent',
                },
                {label: t('information:text_no_visa'), value: 'No visa'},
              ]}
              placeholder={t('information:text_visa_type')}
              {...dropdownProps}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_iqama_no')}
              placeholderTextColor={colors.placeholder}
              value={form[IQAMA_NUMBER]}
              onChangeText={value => {
                if (value.length > 10) return;
                onChangeForm(IQAMA_NUMBER, value);
              }}
              keyboardType="numeric"
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_profession')}
              placeholderTextColor={colors.placeholder}
              value={form[PROFESSION]}
              onChangeText={value => onChangeForm(PROFESSION, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_border_no')}
              placeholderTextColor={colors.placeholder}
              value={form[BORDER_NO]}
              // onChangeText={value => onChangeForm(BORDER_NO, value)}
              onChangeText={value => {
                if (value.length > 10) return;
                onChangeForm(BORDER_NO, value);
              }}
              keyboardType="numeric"
            />
            <DropDownPicker
              open={openThatDropdown(REGION)}
              setOpen={value => setOpenThatDropdownValue(value, REGION)}
              value={form[REGION]}
              setValue={value => onChangeForm(REGION, value())}
              items={[
                {label: t('information:text_makkah'), value: 'Makkah'},
                {label: t('information:text_riyadh'), value: 'Riyadh'},
                {
                  label: t('information:text_Eastern_province'),
                  value: 'Eastern Province',
                },
                {label: t('information:text_asir'), value: 'Asir'},
                {label: t('information:text_jizan'), value: 'Jizan'},
                {label: t('information:text_madina'), value: 'Madina'},
                {label: t('information:text_qasim'), value: 'Qasim'},
                {label: t('information:text_tabuk'), value: 'Tabuk'},
                {label: t('information:text_baha'), value: 'Baha'},
                {label: t('information:text_hail'), value: 'Hail'},
                {label: t('information:text_najran'), value: 'Najran'},
                {label: t('information:text_al_jouf'), value: 'Al Jouf'},
                {
                  label: t('information:text_Northern_region'),
                  value: 'Northern Region',
                },
              ]}
              placeholder={t('information:text_region')}
              {...dropdownProps}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_kafeel_name')}
              placeholderTextColor={colors.placeholder}
              value={form[KAFEEL_NAME]}
              onChangeText={value => onChangeForm(KAFEEL_NAME, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_kafeel_mobile')}
              placeholderTextColor={colors.placeholder}
              value={form[KAFEEL_MOBILE_NO]}
              onChangeText={value => onChangeForm(KAFEEL_MOBILE_NO, value)}
            />

            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_oep_name')}
              placeholderTextColor={colors.placeholder}
              value={form[OEP_NAME]}
              onChangeText={value => onChangeForm(OEP_NAME, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_OEP_Registration')}
              placeholderTextColor={colors.placeholder}
              value={form[OEP_Registration_No]}
              onChangeText={value => onChangeForm(OEP_Registration_No, value)}
            />
            <TextInput
              mode="outlined"
              style={formStyling.style}
              placeholder={t('information:text_amount_paid')}
              placeholderTextColor={colors.placeholder}
              value={form[AMOUNT_PAID]}
              onChangeText={value => onChangeForm(AMOUNT_PAID, value)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.datePicker(colors, formStyling)}
              onPress={() => setOpenDatePicker(WORK_START_DATE)}>
              <Text
                style={{
                  fontSize: formStyling.fontSize,
                  color: form[WORK_START_DATE]
                    ? colors.text
                    : colors.placeholder,
                }}>
                {form[WORK_START_DATE]
                  ? form[WORK_START_DATE]
                  : t('information:text_work_start_date')}
              </Text>
            </TouchableOpacity>
            <DropDownPicker
              open={openThatDropdown(CURRENT_WORK_STATUS)}
              setOpen={value =>
                setOpenThatDropdownValue(value, CURRENT_WORK_STATUS)
              }
              value={form[CURRENT_WORK_STATUS]}
              setValue={value => onChangeForm(CURRENT_WORK_STATUS, value())}
              items={[
                {label: t('information:text_on_job'), value: 'On job'},
                {label: t('information:text_stopped'), value: 'Stopped'},
              ]}
              placeholder={t('information:text_current_work_status')}
              {...dropdownProps}
            />
            <TouchableOpacity
              style={styles.datePicker(colors, formStyling)}
              onPress={() => setOpenDatePicker(WORK_END_DATE)}>
              <Text
                style={{
                  fontSize: formStyling.fontSize,
                  color: form[WORK_END_DATE] ? colors.text : colors.placeholder,
                }}>
                {form[WORK_END_DATE]
                  ? form[WORK_END_DATE]
                  : t('information:text_work_end_date')}
              </Text>
            </TouchableOpacity>
            <DropDownPicker
              open={openThatDropdown(LEGAL_STATUS)}
              setOpen={value => setOpenThatDropdownValue(value, LEGAL_STATUS)}
              value={form[LEGAL_STATUS]}
              setValue={value => onChangeForm(LEGAL_STATUS, value())}
              items={[
                {label: t('information:text_legal'), value: 'Legal'},
                {
                  label: t('information:text_iqama_expire'),
                  value: 'Iqama expire',
                },
                {label: t('information:text_huroob'), value: 'Huroob'},
                {label: t('information:text_wanted'), value: 'Wanted'},
                {
                  label: t('information:text_iqama_not_issued'),
                  value: 'Iqama not issued',
                },
              ]}
              placeholder={t('information:text_legal_status')}
              {...dropdownProps}
            />
            {/*  */}
            <View style={styles.attachmentCon(formStyling)}>
              <Text style={styles.attachmentLabel(colors, formStyling)}>
                {t('information:text_passport_attachment')}
              </Text>
              <View style={[styles.selectImageCon(formStyling)]}>
                {form[PASSPORT_PHOTO] ? (
                  <Avatar.Image
                    size={moderateScale(70)}
                    source={{uri: form[PASSPORT_PHOTO]?.uri}}
                  />
                ) : (
                  <Avatar.Icon
                    style={{}}
                    size={moderateScale(50)}
                    icon={'camera-image'}
                    color={colors.background}
                  />
                )}
                <Button
                  uppercase={false}
                  mode="contained"
                  style={[styles.selectImageBtn(colors)]}
                  contentStyle={[
                    styles.selectImageBtn(colors),
                    {width: '100%', borderRadius: 0},
                  ]}
                  labelStyle={styles.selectImageLabel(colors, formStyling)}
                  onPress={() => onSelectImage(PASSPORT_PHOTO)}>
                  {t('common:text_select_image')}
                </Button>
              </View>
            </View>
            {/*  */}

            <View style={styles.attachmentCon(formStyling)}>
              <Text style={styles.attachmentLabel(colors, formStyling)}>
                {t('information:text_cnic_attachment')}
              </Text>
              <View style={[styles.selectImageCon(formStyling)]}>
                {form[CNIC_PHOTO] ? (
                  <Avatar.Image
                    size={moderateScale(70)}
                    source={{uri: form[CNIC_PHOTO]?.uri}}
                  />
                ) : (
                  <Avatar.Icon
                    style={{}}
                    size={moderateScale(50)}
                    icon={'camera-image'}
                    color={colors.background}
                  />
                )}
                <Button
                  uppercase={false}
                  mode="contained"
                  style={[styles.selectImageBtn(colors)]}
                  contentStyle={[
                    styles.selectImageBtn(colors),
                    {width: '100%', borderRadius: 0},
                  ]}
                  labelStyle={styles.selectImageLabel(colors, formStyling)}
                  onPress={() => onSelectImage(CNIC_PHOTO)}>
                  {t('common:text_select_image')}
                </Button>
              </View>
            </View>
            {/*  */}
            <View style={styles.attachmentCon(formStyling)}>
              <Text style={styles.attachmentLabel(colors, formStyling)}>
                {t('information:text_iqama_attachment')}
              </Text>
              <View style={[styles.selectImageCon(formStyling)]}>
                {form[IQAMA_PHOTO] ? (
                  <Avatar.Image
                    size={moderateScale(70)}
                    source={{uri: form[IQAMA_PHOTO]?.uri}}
                  />
                ) : (
                  <Avatar.Icon
                    style={{}}
                    size={moderateScale(50)}
                    icon={'camera-image'}
                    color={colors.background}
                  />
                )}
                <Button
                  uppercase={false}
                  mode="contained"
                  style={[styles.selectImageBtn(colors)]}
                  contentStyle={[
                    styles.selectImageBtn(colors),
                    {width: '100%', borderRadius: 0},
                  ]}
                  labelStyle={styles.selectImageLabel(colors, formStyling)}
                  onPress={() => onSelectImage(IQAMA_PHOTO)}>
                  {t('common:text_select_image')}
                </Button>
              </View>
            </View>
            {/*  */}
            <DropDownPicker
              open={openThatDropdown(PROBLEM_TYPE)}
              setOpen={value => setOpenThatDropdownValue(value, PROBLEM_TYPE)}
              value={form[PROBLEM_TYPE]}
              setValue={value => onChangeForm(PROBLEM_TYPE, value())}
              items={[
                {label: t('information:text_final_exit'), value: 'Final exit'},
                {
                  label: t('information:text_legal_assistance'),
                  value: 'Legal assistance',
                },
                {label: t('information:text_tanfeez'), value: 'Tanfeez Court'},
                {
                  label: t('information:text_matloob'),
                  value: 'Matloob Case (specify amount)',
                },
                {
                  label: t('information:text_pending_salaries'),
                  value: 'Pending Salaries',
                },
                {
                  label: t('information:text_death'),
                  value: 'Death Compensation',
                },
                {label: t('information:text_diyyat'), value: 'Diyyat'},
                {
                  label: t('information:text_help_in_jail'),
                  value: 'Help in Jail matters',
                },
                {label: t('information:text_other'), value: 'Other'},
              ]}
              placeholder={t('information:text_problem_type')}
              {...dropdownProps}
            />
            <TextInput
              mode="outlined"
              style={[formStyling.style]}
              placeholder={t('information:text_problem_details')}
              placeholderTextColor={colors.placeholder}
              value={form[PROBLEM_DETAILS]}
              onChangeText={value => onChangeForm(PROBLEM_DETAILS, value)}
            />
            <Button
              mode="contained"
              style={{
                height: moderateScale(45),
                marginTop: formStyling.marginTop,
                borderRadius: moderateScale(45) / 2,
              }}
              contentStyle={{height: moderateScale(45)}}
              labelStyle={{
                color: colors.background,
                fontSize: formStyling.fontSize,
              }}
              loading={loading === loaders.SAVE}
              onPress={onProceed}>
              {t('common:text_save')}
            </Button>
            {/*  */}
            <DateTimePickerModal
              isVisible={openDatePicker === WORK_START_DATE ? true : false}
              mode="date"
              onConfirm={date => {
                onChangeForm(WORK_START_DATE, getDateInString(date));
                setOpenDatePicker();
              }}
              onCancel={() => setOpenDatePicker()}
              {...(Platform.OS === 'ios' &&
                Appearance.getColorScheme() === 'dark' && {
                  isDarkModeEnabled: true,
                  display: 'inline',
                })}
            />
            <DateTimePickerModal
              isVisible={openDatePicker === WORK_END_DATE ? true : false}
              mode="date"
              onConfirm={date => {
                onChangeForm(WORK_END_DATE, getDateInString(date));
                setOpenDatePicker();
              }}
              onCancel={() => setOpenDatePicker()}
              {...(Platform.OS === 'ios' &&
                Appearance.getColorScheme() === 'dark' && {
                  isDarkModeEnabled: true,
                  display: 'inline',
                })}
            />
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};
export default UserInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContainer: {
    flexGrow: 1,
  },
  datePicker: (colors, formStyling) => ({
    height: formStyling.height,
    width: '100%',
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: colors.border,
    marginTop: formStyling.marginTop,
    backgroundColor: formStyling.backgroundColor,
    paddingLeft: formStyling.paddingLeft,
    borderRadius: formStyling.borderRadius,
    alignItems: 'flex-start',
  }),
  attachmentCon: formStyling => ({
    width: '100%',
    marginTop: formStyling.marginTop,
    paddingLeft: formStyling.paddingLeft,
  }),
  attachmentLabel: (colors, formStyling) => ({
    fontSize: formStyling.fontSize,
    color: colors.placeholder,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  }),
  selectImageCon: formStyling => ({
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: formStyling.marginTop / 1.5,
  }),
  selectImageBtn: colors => ({
    height: moderateScale(37),
    borderRadius: moderateScale(37) / 6,
    width: '45%',
    backgroundColor: colors.lightGrey,
  }),
  selectImageLabel: (colors, formStyling) => ({
    color: colors.text,
    fontSize: formStyling.fontSize,
  }),
});
