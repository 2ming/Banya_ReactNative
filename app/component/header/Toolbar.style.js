import {Platform, StyleSheet} from 'react-native';
// import { isIPhoneX } from '../../utils/DimensionUtils';

// export const STATUS_BAR_HEIGHT_IOS = isIPhoneX() ? 30 : 20;
export const STATUS_BAR_HEIGHT_IOS = 30;
export const TOOLBAR_HEIGHT = Platform.select({
  ios: 44 + STATUS_BAR_HEIGHT_IOS,
  android: 44,
});
export const PADDING_TOP = Platform.select({
  ios: STATUS_BAR_HEIGHT_IOS,
  android: 0,
});

export default StyleSheet.create({
  container: {
    height: TOOLBAR_HEIGHT,
    paddingTop: PADDING_TOP,
    backgroundColor: '#4b7bab',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
  actionBar: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: TOOLBAR_HEIGHT,
    paddingTop: PADDING_TOP,
  },
  buttons: {
    flexDirection: 'row',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  backIcon: {
    // height: 19,
    // width: 11,
    height: 18,
    width: 18
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  buttonIcon: {
    height: 18,
    width: 20,
  },
});
