/**
 created by Lex. 2019/7/29

 Top 250 数据实时请求，并不放在Redux做状态管理以及缓存

 使用 react-native-ratings 而不是 react-native-star-rating , 因为 react-native-star-rating 依赖 react-native-vector-icons
 尽量选择轻型第三方库

 **/
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

//组件
import {Rating, AirbnbRating} from 'react-native-ratings';
import Toolbar from '../../component/header/Toolbar';
import ImageButton from '../../component/button/ImageButton';
import {connect} from 'react-redux';
import LinearView from '../../component/linear/LinearView';

//数据
import {getTop250} from '../../utils/request/MovieR';
import {appendNewTop250Data} from '../../redux/movies';

//资源
import {COLOR, WIDTH} from "../../utils/contants";

const ICON_LEFT = require('../../constant/image/movie/left.png');
const ICON_RIGHT = require('../../constant/image/movie/right.png');
const ICON_RIGHT_ARROW = require('../../constant/image/right_nullArrow.png');


class Top250 extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      //Top xx-xx
      start: 0,
      end: 25,
      page: 0,
      //每页50条数据，分两节  0  1
      nodeIndex: 0,
      // start: this.page,
      top250List: [],
      isBottomLoadingShow: false,
    }
  }

  getStartIndex = (page) => {
    const start = 50 * this.state.page + 25 * this.state.nodeIndex;

  }

  async componentWillMount(): void {
    console.info('this.state.page', this.state.page)
    const currentPageData = this.props.top250List?.[this.state.page] || [];
    if (currentPageData.length === 0) {
      await this.freshData(this.state.start, this.state.end);
    }
  }

  //是追加数据时，拼接到原有数据
  freshData = async (start, end) => {
    // try {
    //   // const start = this.state.start;
    //   const count = end - start;
    //   const data = await getTop250(start, count);
    //
    //   const originalData = this.state.top250List;
    //   const newData = originalData.concat(data.subjects);
    //
    //   this.setState({top250List: newData})
    //   console.info('data', data)
    // } catch (e) {
    //   console.warn('top250', e);
    // }
    await this.props.appendNewTop250Data(this.state.page, this.state.nodeIndex);
    this.setState({isBottomLoadingShow: false})
    this.forceUpdate();
  }

  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }


  //获取当前电影的Top start
  getTopIndex = () => {
    const baseStart = this.state.page * 50 + 1;
    return baseStart;
  }

  //点击进入下一页
  onToNextPagePress = () => {
    const currentPage = this.state.page;
    if (currentPage <= 3) {
      this.setState({page: (currentPage + 1), nodeIndex: 0}, this.freshData)
    }
  }

  reachListBottom = async () => {
    const currentPageData = this.props.top250List?.[this.state.page] || [];
    console.info('To250到底,当前长度', currentPageData.length)
    if (currentPageData.length === 25) {
      this.setState({nodeIndex: 1, isBottomLoadingShow: true}, () => {
        this.freshData()
      })
    } else if (currentPageData.length === 50) {

    }

    // console.info('到达底部')
    // if (this.state.top250List.length >= 50) {
    //   this.setState({isBottomLoadingShow: false})
    // } else {
    //   this.setState({isBottomLoadingShow: true});
    //   await this.freshData(25, 50);
    //   this.setState({isBottomLoadingShow: false})
    // }
  }


  showBottomView = () => {
    if (this.state.isBottomLoadingShow) {
      return (
        <View>
          <ActivityIndicator size={'large'}/>
        </View>
      );
    } else {
      return (
        <View>
          <TouchableOpacity>
            <Text>加载下一页</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }


  transformRateToValue = (rate) => {
    let value = 0;
    if (rate >= 9.2) {
      value = 5;
    } else if (rate >= 8.3) {
      value = 4.5;
    } else if (rate >= 7.5) {
      value = 4;
    } else if (rate >= 6.6) {
      value = 3.5;
    } else if (rate >= 6) {
      value = 3;
    } else if (rate >= 5) {
      value = 2.5;
    } else if (rate >= 4) {
      value = 2;
    } else if (rate >= 3) {
      value = 1.5;
    } else if (rate >= 2) {
      value = 1;
    } else {
      value = 0.5
    }
    return value;
  }

  renderTop250Item = ({item, index}) => {

    const ITEM_HEIGHT = 150;
    const ITEM_WIDTH = 106;

    const showOrgTitle = item.title == item.original_title;
    const rateValue = item?.rating?.average;

    const peoples = item.directors?.concat(item?.casts);

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 8
      }}>
        <Image source={{uri: item.images?.small}} style={{width: ITEM_WIDTH, height: ITEM_HEIGHT}}
               resizeMode='contain'/>
        <View style={{
          flex: 1,
          height: ITEM_HEIGHT,
          justifyContent: 'space-between',
          paddingTop: 15,
          paddingHorizontal: 10
        }}>

          <View>
            <Text style={styles.movie_title}>{item.title}</Text>
            {showOrgTitle ? null : <Text
              numberOfLines={1}
              style={styles.movie_org_title}>{'(' + item.original_title + ')'}</Text>
            }
          </View>

          <View
            style={{paddingLeft: 5, flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              readonly={true}
              type='star'
              // ratingImage={WATER_IMAGE}
              // ratingColor='yellow'
              // ratingBackgroundColor='#c8c7c8'
              ratingCount={5}
              startingValue={this.transformRateToValue(rateValue)}
              imageSize={13}
              style={{width: 60}}
              // style={{ paddingVertical: 10 }}
            />
            <Text
              style={{marginLeft: 10, fontSize: 13, color: '#000', fontWeight: 'bold'}}>{item?.rating?.average}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{marginRight: 8}}>{item.year}</Text>
            {item.genres?.map((item, index) => (
              <View key={index}>
                <Text style={{marginHorizontal: 4, color: '#614d62'}}>{item}</Text>
              </View>)
            )}
          </View>

          <Text numberOfLines={2} style={{flexDirection: 'row', alignItems: 'center', color: '#305058'}}>
            {peoples?.map((item, index) => (
              <Text key={index}
                    onPress={() => {
                      console.info('Name', item.name)
                    }}
                    style={{marginHorizontal: 3, fontSize: 13}}>{item.name + '  '}</Text>
            ))}
          </Text>


        </View>

        <View style={{
          ...StyleSheet.absoluteFill,
          alignItems: 'flex-end',
        }}>
          <Text style={styles.textNumber}>{'No.' + (this.getTopIndex() + index)}</Text>
        </View>

      </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  render() {

    //取出当前页的数据
    const currentPageData = this.props.top250List?.[this.state.page] || [];

    //是否显示加载下一页的底部框
    let showBottomToNext = false;
    if (currentPageData.length === 50) {
      showBottomToNext = true;
    }

    return (
      <LinearView
        colors={['#cce0eb','#FEE','#dfdbab']}
        style={{flex: 1}}>
        <Toolbar title={'Top250'}/>

        <View
          style={styles.barContainer}>
          <View style={styles.changeImages}>
            <ImageButton
              source={ICON_RIGHT} style={{transform: [{rotate: '180deg'}]}}
              isShow={this.state.page !== 0}
              onPress={() => {
                this.setState({page: (this.state.page - 1)},()=>this.forceUpdate())
              }}
            />
            <ImageButton
              source={ICON_RIGHT}
              isShow={this.state.page !== 4}
              onPress={this.onToNextPagePress}
            />
          </View>

          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text> {'当前显示 Top' + (this.state.page * 50 + 1) + '--Top' + (this.state.page + 1) * 50}</Text>
          </View>
        </View>

        <FlatList
          keyExtractor={this._keyExtractor}
          data={currentPageData}
          extraData={this.props.top250List}
          renderItem={this.renderTop250Item}
          onEndReachedThreshold={0.3}
          onEndReached={this.reachListBottom}
          ListFooterComponent={() => {
            if (this.state.isBottomLoadingShow) {
              return (
                <View style={{height: 60, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size={'large'}/>
                </View>
              );
            } else {
              if (!showBottomToNext) {
                return null;
              }
              return (
                <TouchableOpacity
                  onPress={this.onToNextPagePress}
                  style={{
                    height: 60,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {this.state.page === 4 ? null :
                    <View style={{flexDirection: 'row', backgroundColor: COLOR.defaultColor, alignItems: 'center'}}>
                      <Text style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        color: '#FFF',
                        fontStyle: 'italic'
                      }}>{'Top ' + ((this.state.page + 1) * 50 + 1) + '-' + (this.state.page + 2) * 50}</Text>
                      <Image source={ICON_RIGHT_ARROW}
                             style={{backgroundColor: COLOR.defaultColor, height: 16, width: 28}}/>

                    </View>}
                  <View style={{...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15}}>到底了</Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
        />

        {/*{this.showBottomView()}*/}

      </LinearView>
    );
  }
}

export default connect(state => ({
  top250List: state.movies.top250,
}), {
  appendNewTop250Data,
})(Top250);


const styles = StyleSheet.create({
  changeImages: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  barContainer: {
    marginHorizontal: 20,
    marginVertical: 6,
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10
  },
  movie_title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  movie_org_title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666'
  },
  textNumber: {
    backgroundColor: '#dea554',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8
  }
})
