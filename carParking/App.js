
import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  AppRegistry,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Picker,
  FlatList
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Map from './screens/Map';

import * as theme from './screens/theme';

const { Marker } = MapView;

const parkingsSpots = [
  {
    id:1,
    title:'Parking 1',
    price:5,
    rating:4.2,
    spots:20,
    free:10,
    coordinate:{
      latitude:37.78810,
      longitude:-122.4320,
    },
    description:`2012 ut minim irure anim aute enim ea ea adipisicing Lorem duis. 
Laborum pariatur dolor cillum sit nostrud fugiat ipsum laboris non duis qui fugiat. 
Amet nostrud Lorem ad eu non tempor exercitation proident aliqua minim labore.`,
  },
  {
    id:2,
    title:'Parking 2',
    price:6,
    rating:4.5,
    spots:15,
    free:7,
    coordinate:{
      latitude:37.78815,
      longitude:-122.4315,
    },
    description:`2015 ut minim irure anim aute enim ea ea adipisicing Lorem duis. 
Laborum pariatur dolor cillum sit nostrud fugiat ipsum laboris non duis qui fugiat. 
Amet nostrud Lorem ad eu non tempor exercitation proident aliqua minim labore.`,
  },
  {
    id:3,
    title:'Parking 3',
    price:8,
    rating:4,
    spots:10,
    free:8,
    coordinate:{
      latitude:37.78820,
      longitude:-122.4320,
    },
    description:`2018 ut minim irure anim aute enim ea ea adipisicing Lorem duis. 
Laborum pariatur dolor cillum sit nostrud fugiat ipsum laboris non duis qui fugiat. 
Amet nostrud Lorem ad eu non tempor exercitation proident aliqua minim labore.`,
  },
]

const {height,width} = Dimensions.get('screen');

class ParkingApp extends Component{

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     latitude : 0,
  //     longitude : 0,
  //     error : null
  //   }
  // } 
  state = {
    hours:{},
    active: null,
    activeModal:null
  }
  
  componentWillMount = () => {
    const { parkings } = this.props;
    const hours = {}
    parkings.map(parking => {hours[parking.id] = 1;});
    this.setState({ hours })
  }
  handleHours(id, value) {
    const { hours } = this.state;
    hours[id] = value;
    this.setState({hours});
  }
  renderHeader (){
    return(
      <View style={styles.header}>
          <View style={{flex:1, justifyContent: 'center',}}>
            <Text style={styles.headerTitle}>Detected location</Text>
            <Text style={styles.headerLocation}>Ho Chi Minh City</Text>
          </View>
          <View style={{flex:1, justifyContent: 'center', alignItems:'flex-end'}}>
            <TouchableWithoutFeedback>
                <Entypo name="menu" size={theme.SIZES.icon*2} color={theme.COLORS.grey} />
            </TouchableWithoutFeedback>
          </View>
      </View>
    )
  }
  renderParking(item){
    const { hours } =this.state;
    const  totalPrice = item.price * hours[item.id]
    return(
      <TouchableWithoutFeedback key={`parking-${item.id}`} onPress={() => this.setState({active:item.id})}>
        <View style={[styles.parking,styles.shadow]}>
          <View style={styles.hours}>
          <Text style={styles.hoursTitle}>x{item.spots} {item.title}</Text>

          {/* <Picker
            selectedValue={this.state.hours[item.id || 1]}
            style={{height: 50, width:200}}
            itemStyle={{color:'red'}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({hours: {...this.state.hours, [item.id]:itemValue}})
            }>
            <Picker.Item label="01:00" value="1" />
            <Picker.Item label="02:00" value="2" />
            <Picker.Item label="03:00" value="3" />
            <Picker.Item label="04:00" value="4" />
            <Picker.Item label="05:00" value="5" />
            
          </Picker> */}
          <View style={{ flexDirection:'row', alignItems:'center'}}> 
            {this.renderHours(item.id)}
            <Text style={{ color: theme.COLORS.grey}}>hours</Text>
          </View>
          {/* <View style={{width: 100,borderRadius:6, borderColor:'grey', borderWidth: 0.5, padding:4}}>
            <Text style={{fontSize:theme.SIZES.font}}>
                  05:00
            </Text>
          </View> */}
        </View>

        <View style={styles.parkingInfoContainer}>

          <View style={styles.parkingInfo}>

            <View style={styles.parkingIcon}>
              <Icon name="tag" size={theme.SIZES.icon} color={theme.COLORS.grey}/>
                <Text style={{marginLeft:theme.SIZES.base/2}}>
                  ${item.price}
                </Text>
            </View>

            <View style={styles.parkingIcon}>
              <Icon name="star" size={theme.SIZES.icon} color={theme.COLORS.grey}/>
              
                <Text style={{marginLeft:theme.SIZES.base/2}}>
                   {item.rating}
                </Text>
            </View>

          </View>

          <TouchableOpacity style={styles.buy} onPress={() => this.setState({activeModal: item})}>
              <View style={styles.buyTotal}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Icon name="dollar" size={theme.SIZES.icon* 1.5} color={theme.COLORS.white}/>
                  <Text style={styles.buyTotalPrice}>{totalPrice}</Text>
                </View>
                <Text style={{color:theme.COLORS.white}}>{item.price}x{hours[item.id]} hrs</Text>
              </View>

              <View style={styles.buyBtn}>
                <Ionicons name="ios-arrow-forward" size={theme.SIZES.icon*1.5} color={theme.COLORS.white}/>
              </View>
          </TouchableOpacity>
        </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderParkings(){
    return(
      <FlatList
        horizontal 
        style={styles.parkings}
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator ={false}
        decelerationRate={0}
        scrollEventThrottle={16}
        snapToAlignment='center'
        data={this.props.parkings}
        extraData={this.state}
        keyExtractor={(item, index) =>`${item.id}`} //add `${}` to fix number type 
        renderItem={({ item }) => this.renderParking(item)}
      />
    )
  }
  renderHours(id) {
    const { hours } = this.state;
    const availableHours = [1, 2, 3, 4, 5, 6]
    return(
      <ModalDropdown 
        defaultIndex={availableHours.findIndex((value, index) => value === id)}
        defaultValue={`0${hours[id]}:00`|| '01:00'}
        options={availableHours}
        onSelect={(index,value) => this.handleHours(id, value)}
        style={styles.hoursDropdown}
        dropdownStyle={styles.hoursDropdownStyle}
        renderRow={(option, index, isSelected) => (
          <Text style={styles.hoursDropdownOption}>{`0${option}:00`}</Text>
        )}
        renderButtonText={option => `0${option}:00`}
      />
    )
  }
  renderModal() {
    const { activeModal, hours, } = this.state;
    console.log('activeModal', activeModal);
    if(!activeModal) return null;
    return (
      <Modal 
        isVisible
        useNativeDriver
        swipeDirection="down"
        backdropColor={theme.COLORS.overlay}
        style={styles.modalContainer}
        onBackButtonPress={() => this.setState({activeModal:null})}
        onBackdropPress={() => this.setState({activeModal:null})}
        onSwipeComplete={() => this.setState({activeModal: null})}
      >
        <View style={styles.modal}>
          <View>
            <Text style={{fontSize: theme.SIZES.font * 1.5}}>
              {activeModal.title}
            </Text>
          </View>

          <View style={{paddingVertical:theme.SIZES.base*3}}>
            <Text style={{color: theme.COLORS.grey, fontSize:theme.SIZES.font * 1.1}}>
              {activeModal.description}
            </Text>
          </View>
          
          <View style={styles.modalInfo}>
            <View style={[styles.parkingIcon,{justifyContent:'flex-start'}]}>
                <Icon name="tag" size={theme.SIZES.icon* 1.1} color={theme.COLORS.grey}/>
                <Text style={{fontSize:theme.SIZES.icon * 1.1}}> ${activeModal.price}</Text>
              </View>

              <View style={[styles.parkingIcon,{justifyContent:'flex-start'}]}>
                <Icon name="star" size={theme.SIZES.icon* 1.1} color={theme.COLORS.grey}/>
                <Text style={{fontSize:theme.SIZES.icon * 1.1}}> {activeModal.rating}</Text>
              </View>
            <View style={[styles.parkingIcon,{justifyContent:'flex-start'}]}>
                <Entypo name="location-pin" size={theme.SIZES.icon* 1.1} color={theme.COLORS.grey}/>
                <Text style={{fontSize:theme.SIZES.icon * 1.1}}> {activeModal.price}km</Text>
              </View>

              <View style={[styles.parkingIcon,{justifyContent:'flex-start'}]}>
                <Icon name="car" size={theme.SIZES.icon* 1.1} color={theme.COLORS.grey}/>
                <Text style={{fontSize:theme.SIZES.icon * 1.1}}> {activeModal.free}/{activeModal.spots}</Text>
              </View>
          </View>

          <View style={styles.modalHours}>
            <Text style={{textAlign:'center',fontWeight:'500'}}>Choose your Booking Period:</Text>
            <View style={styles.modalHoursDropdown}> 
              {this.renderHours(activeModal.id)}
              <Text style={{ color: theme.COLORS.grey}}>hours</Text>
            </View>
          </View>

          <View>
            <TouchableOpacity style={styles.payBtn}>
                  <Text style={styles.payText}>
                  Proceed to pay ${activeModal.price * hours[activeModal.id]}
                  </Text>
                  <Entypo name="chevron-right" size={theme.SIZES.icon* 1.5} color={theme.COLORS.white}/>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  render(){
    const { currentPosition, parkings } = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <MapView
          //provider={PROVIDER_GOOGLE} 
          style={styles.map}
          region={currentPosition}
        >
          {parkings.map(parking =>(
              <Marker 
                key={`marker-${parking.id}`}
                coordinate={parking.coordinate}
              >
                <TouchableWithoutFeedback onPress={() => this.setState({active: parking.id})}>
                  <View style={[
                    styles.marker,
                    styles.shadow,
                    this.state.active === parking.id ? styles.active : null]}>
                      <Text style={styles.markerPrice}>${parking.price}</Text>
                      <Text style={styles.markerStatus}> ${parking.free}/${parking.spots}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </Marker>
            )
          )}
        </MapView>
        {this.renderParkings()}
        {this.renderModal()}

      </View>
    )
  }
}

ParkingApp.defaultProps = {
  currentPosition:{
    latitude: 37.78825,
    longitude: -122.4325,
    latitudeDelta: 0.001,
    longitudeDelta: 0.0021,
  },
  parkings: parkingsSpots,
}

export default ParkingApp;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: theme.COLORS.white
    // ...StyleSheet.absoluteFillObject,
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    flex:3,
    // width:100,
    // height:100
  },
  header: {
    flex:0.5,
    flexDirection:'row',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 0.5,
    paddingBottom: theme.SIZES.base * 0.5
  },
  headerTitle:{
    color: theme.COLORS.grey,
  },
  hoursDropdown:{
    borderRadius:theme.SIZES.base/2,
     borderColor:'grey',
     borderWidth: 0.5,
    //  paddingHorizontal:theme.SIZES.base,
     padding:theme.SIZES.base,
     marginHorizontal:theme.SIZES.base/2
  },
  hoursDropdownStyle:{
    marginLeft:-theme.SIZES.base,
    paddingHorizontal:theme.SIZES.base/2,
    marginVertical: -theme.SIZES.base,
  },
  hoursDropdownOption:{
    paddingVertical:4,
    fontSize: theme.SIZES.font
  },
  headerLocation:{
    fontSize: theme.SIZES.font,
    fontWeight:'500',
    paddingVertical: theme.SIZES.base/3
  },
  parkings:{
    position:'absolute',
    right:0,
    left:0,
    bottom:0,
    paddingBottom:theme.SIZES.base*2,
  },
  parking:{
    flexDirection:'row',
    backgroundColor:theme.COLORS.white,
    borderRadius:6,
    padding: theme.SIZES.base,
    marginHorizontal:theme.SIZES.base*2,
    width: width -(theme.SIZES.base*2*2),
  },
  buy:{
    flex:2,
    flexDirection:'row',
    paddingVertical:theme.SIZES.base,
    paddingHorizontal:theme.SIZES.base *1.5,
    paddingLeft:12,
    paddingRight:12,
    backgroundColor:theme.COLORS.red,
    borderRadius:6,
  },
  buyTotal:{
    flex:1,
    justifyContent:'space-evenly'
  },
  buyBtn:{
    flex:0.5,
    justifyContent:'center', 
    alignItems:'flex-end'
  },
  buyTotalPrice:{
    fontSize:theme.SIZES.base*2, 
    color:theme.COLORS.white,
    fontWeight:'600',
    paddingLeft:theme.SIZES.base/6
  },
  marker: {
    backgroundColor:"white",
    borderRadius:theme.SIZES.base * 2,
    paddingVertical:12,
    paddingHorizontal:theme.SIZES.base * 2,
    //padding:12,
    //justifyContent: 'center',
    //alignItems: 'center',
    flexDirection: "row",
    //marginTop: 12,
    //height: 30,
    //width: 120,
    //marginHorizontal: 20,
    //marginBottom : 10,
    //elevation: 1.5,
    borderColor: theme.COLORS.white,
    borderWidth:0.5,
  }, 
  markerPrice:{
    color:theme.COLORS.red, 
    fontWeight:'bold'
  },
  markerStatus:{color: theme.COLORS.grey},
  shadow:{
    shadowColor: theme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    },
  active: {
    borderColor:'red',
  },
  hours:{
    flex:1,
    flexDirection:'column',
    marginLeft: theme.SIZES.base/2,
    justifyContent: 'space-evenly',
  },
  hoursTitle:{
    fontSize:theme.SIZES.text,
    fontWeight:'600'
  },
  parkingInfoContainer:{
    flex:1.5,
    flexDirection:'row',
  },
  parkingInfo:{
    flex:0.75, 
    justifyContent: 'space-evenly', 
    marginHorizontal:theme.SIZES.base*1.5,
    //paddingVertical: theme.SIZES.base*2
  },
  parkingIcon:{
    //flex:1,
    flexDirection:'row',
    justifyContent:'space-between', 
    alignItems:'center',
    paddingVertical: theme.SIZES.base/1.2,
    
  },
  modalContainer:{
    margin:0,
    justifyContent:'flex-end'
  },
  modal:{
    backgroundColor: theme.COLORS.white,
    height:height*0.75,
    padding:theme.SIZES.base,
    // justifyContent:'space-between'
    flexDirection:'column',
    borderTopLeftRadius:theme.SIZES.base,
    borderTopRightRadius:theme.SIZES.base,
    borderBottomRightRadius: theme.SIZES.base,
    borderBottomLeftRadius: theme.SIZES.base
  },
  modalInfo:{
    flexDirection:'row', 
    justifyContent: 'space-evenly',
    paddingVertical:theme.SIZES.base,
    borderTopWidth:1,
    borderTopColor:theme.COLORS.overlay,
    borderBottomWidth:1,
    borderBottomColor:theme.COLORS.overlay,
  },
  modalHours:{
    paddingVertical: height*0.02,
  },
  modalHoursDropdown:{ 
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: theme.SIZES.base
  },
  payBtn:{
    backgroundColor:theme.COLORS.red,
    borderRadius:6,
    padding:theme.SIZES.base*1.5,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  payText:{
    fontSize:theme.SIZES.base*1.5, 
    color:theme.COLORS.white,
    fontWeight:'600'
  }
});
AppRegistry.registerComponent('App', () => App);
