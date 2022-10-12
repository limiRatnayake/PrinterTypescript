/* eslint-disable react-native/no-inline-styles */
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState, MutableRefObject} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
  ColumnAliment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import Loading from '../Loading';
import {DeviceType} from './FindPrinter';
import {navigate} from './App';
import AntIcon from 'react-native-vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';
import {useRef} from 'react';
import {Buffer} from 'buffer';
import ShareableReactImage from './createImage';
import {captureRef} from 'react-native-view-shot';

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

export interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

export const PORT: string = '9100';

export enum DevicesEnum {
  usb = 'usb',
  net = 'net',
  blu = 'blu',
}

const deviceWidth = Dimensions.get('window').width;
const splashImage = require('../assets/copy.jpeg');
// const EscPosEncoder = require('esc-pos-encoder')

export const HomeScreen = ({route}: any) => {
  const [selectedValue, setSelectedValue] = React.useState<
    keyof typeof printerList
  >(DevicesEnum.net);
  const [devices, setDevices] = React.useState([]);
  // const [connected, setConnected] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>(
    {},
  );
  let QrRef = useRef<any>(null);

  const data = {
    id: 'Da-02-111022-000685-qRHO',
    outlet: 'Dehiwala',
    franchise: 'Pizza Hut WP',
    display_order_id: 'QRHO',
    platform: 'Webshop',
    delivery_platform_name: 'Dehiwala webshop',
    delivery_platform_logo:
      'https://delivergate-logos.s3.eu-west-2.amazonaws.com/webshop.png',
    price: '800.00',
    status: 'Completed',
    items: [
      {
        id: 467,
        order_id: 411,
        item_id: '1',
        quantity: 1,
        price_per_item: 60000,
        total: 60000,
        original_price: 61000,
        is_sale: 1,
        discount_amount: 1000,
        status: 'COMPLETED',
        created_at: '2022-10-11 12:27:38',
        updated_at: '2022-10-11 14:00:04',
        item_name: 'Devilled Chicken',
        category_name: null,
        modifiers: [
          {
            item_id: '1',
            title: 'Sauce',
            selected_item: [
              {
                item_id: '8',
                title: 'Tomato Sauce',
                quantity: '1.00',
                price_per_item: '10000.00',
                display_price: '100',
                modifiers: [],
              },
            ],
            removed_item: [],
          },
          {
            item_id: '3',
            title: 'cool',
            selected_item: [
              {
                item_id: '8',
                title: 'Tomato Sauce',
                quantity: '1.00',
                price_per_item: '5000.00',
                display_price: '50',
                modifiers: [],
              },
            ],
            removed_item: [],
          },
        ],
        tax: 0,
        note: null,
        display_price: '600.00',
      },
      {
        id: 468,
        order_id: 411,
        item_id: '4',
        quantity: 2,
        price_per_item: 10000,
        total: 20000,
        original_price: 10000,
        is_sale: 0,
        discount_amount: 0,
        status: 'COMPLETED',
        created_at: '2022-10-11 12:27:38',
        updated_at: '2022-10-11 14:00:04',
        item_name: 'Black Chicken',
        category_name: null,
        modifiers: [],
        tax: 0,
        note: null,
        display_price: '100.00',
      },
    ],
    platform_logo:
      'https://delivergate-logos.s3.eu-west-2.amazonaws.com/webshop.png',
    delivery_date_time: '11/10/2022 06:37 pm',
    delivery_time: '06:37 pm',
    delivery_date: '2022-10-11',
    created_date_time: '11/10/2022 05:57 pm',
    created_time: '05:57 pm',
    created_date: '2022-10-11',
    customer_name: 'rushantha chathuranga',
    note: null,
    delivery_type: 'Delivery',
    order_id: 411,
    sub_total: '800.00',
    total_fee: '17.99',
    total_amount: '797.99',
    total_tax: '0.00',
    shipping_method: 'DELIVERY',
    shipping_total: '0.00',
    shipping_tax: null,
    discount: '20.00',
    cash_due: '0.00',
    surcharge: '0.00',
    contact_access_code: null,
    delivergate_customer: {
      id: 38,
      source: null,
      order_id: null,
      first_name: 'rushantha',
      last_name: 'chathuranga',
      address_1: null,
      address_2: null,
      email: 'red.test506+100@gmail.com',
      phone: '+94715498625',
      country_code: '+94',
      city: null,
      state: null,
      postcode: null,
      country: null,
      remote_id: null,
      type: 'WEBSHOP',
      created_at: '2022-08-04 09:19:29',
      updated_at: '2022-10-11 10:42:17',
      latitude: null,
      longitude: null,
      reset_token: null,
      stripe_id: null,
      otp: null,
      status: 1,
      password_reset_code: null,
      password_reset_code_status: 0,
      contact_access_code: '927484',
      address_type: 'STREET_ADDRESS',
      notes: null,
      expo_token: null,
      deleted_at: null,
      address: '974613, Galle Railway Station, Galle, Sri Lanka, 80000',
    },
    payment_method: 'CARD',
    deliveries: [],
    arrive_in: 0,
    shipping_details: {
      id: 667,
      order_tmp_id: 685,
      order_id: 411,
      type: 'RECEIVER',
      first_name: 'rushantha',
      last_name: 'chathuranga',
      email: 'red.test506+100@gmail.com',
      phone: '715498625',
      country_code: '+94',
      address_line_1: '974613',
      address_line_2: 'Galle Railway Station, Galle, Sri Lanka, 80000',
      city: null,
      state: null,
      postcode: null,
      country: null,
      latitude: '6.0332729',
      longitude: '80.2143104',
      created_at: '2022-10-11 12:27:35',
      updated_at: '2022-10-11 12:27:38',
    },
    shopFee: [
      {
        shop_fee_id: 4,
        name: 'Service charge',
        amount: '10.99',
      },
      {
        shop_fee_id: 5,
        name: 'Bag Fee',
        amount: '5.00',
      },
      {
        shop_fee_id: 6,
        name: 'Bill charge',
        amount: '2.00',
      },
    ],
    buttons: [],
  };

  const viewRef: MutableRefObject<any> = React.useRef<any>(null);
  const [showInstagramStory, setShowInstagramStory] = useState(false);
  const [uri, setUri] = useState('');

  const shareDummyImage = async () => {
    try {
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.7,
        result: 'base64',
      });
      console.log(uri);
      setUri(uri);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = async () => {
    try {
      const Printer = printerList[selectedValue];
      Printer.printText('<C>sample text</C>', {
        cut: false,
      });
      var base64Icon = uri;
      //const exampleImageUri = Image.resolveAssetSource(uri).uri

      Printer.printImageBase64(uri, {
        // imageWidth: 500,
        // imageHeight: 500,
      });
      Printer.printBill('<C>sample text</C>');
    } catch (err) {
      console.warn(err);
    }
  };

  const [selectedNetPrinter, setSelectedNetPrinter] =
    React.useState<DeviceType>({
      device_name: 'My Net Printer',
      host: '192.168.8.110', // your host
      port: PORT, // your port
      printerType: DevicesEnum.net,
    });

  React.useEffect(() => {
    if (route.params?.printer) {
      setSelectedNetPrinter({
        ...selectedNetPrinter,
        ...route.params.printer,
      });
    }
  }, [route.params?.printer]);

  const getListDevices = async () => {
    const Printer = printerList[selectedValue];
    // get list device for net printers is support scanning in local ip but not recommended
    if (selectedValue === DevicesEnum.net) {
      await Printer.init();
      setLoading(false);
      return;
    }
    requestAnimationFrame(async () => {
      try {
        await Printer.init();
        const results = await Printer.getDeviceList();
        setDevices(
          results?.map((item: any) => ({
            ...item,
            printerType: selectedValue,
          })),
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    });
  };

  React.useEffect(() => {
    setLoading(true);
    getListDevices().then();
  }, [selectedValue]);

  const handleConnectSelectedPrinter = async () => {
    setLoading(true);
    const connect = async () => {
      try {
        switch (
          selectedValue === DevicesEnum.net
            ? selectedNetPrinter.printerType
            : selectedPrinter.printerType
        ) {
          case 'ble':
            if (selectedPrinter?.inner_mac_address) {
              await BLEPrinter.connectPrinter(
                selectedPrinter?.inner_mac_address || '',
              );
            }
            break;
          case 'net':
            if (!selectedNetPrinter) {
              break;
            }
            try {
              // if (connected) {
              // await NetPrinter.closeConn();
              // setConnected(!connected);
              // }
              const status = await NetPrinter.connectPrinter(
                selectedNetPrinter?.host || '',
                9100,
              );
              setLoading(false);
              console.log('connect -> status', status);
              Alert.alert(
                'Connect successfully!',
                `Connected to ${status.host ?? 'Printers'} !`,
              );
              // setConnected(true);
            } catch (err) {
              Alert.alert('Connect failed!', `${err} !`);
            }
            break;
          case 'usb':
            if (selectedPrinter?.vendor_id) {
              await USBPrinter.connectPrinter(
                selectedPrinter?.vendor_id || '',
                selectedPrinter?.product_id || '',
              );
            }
            break;
          default:
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    await connect();
  };

  const handlePrintBill = async () => {
    let address = '2700 S123 Grand Ave, Los Angeles, CA 90007223, USA.';
    const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
    const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
    const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
    const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
    const RIGHT = COMMANDS.TEXT_FORMAT.TXT_ALIGN_RT;
    const TXT_CUSTOM_SIZE = COMMANDS.TEXT_FORMAT.TXT_CUSTOM_SIZE(80, 80);
    const TXT_4SQUARE = COMMANDS.TEXT_FORMAT.TXT_4SQUARE;
    const CTL_HT = COMMANDS.FEED_CONTROL_SEQUENCES.CTL_HT;
    const REVERSE = '\x1DB\x01';
    const POUND = '\u{20AC}';
    try {
      const getDataURL = () => {
        (QrRef as any).toDataURL(callback);
      };
      const callback = async (dataURL: string) => {
        let qrProcessed = dataURL.replace(/(\r\n|\n|\r)/gm, '');
        // Can print android and ios with the same type or with encoder for android
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const Printer: typeof NetPrinter = printerList[selectedValue];
          Printer.printImage(
            `file:///data/user/0/com.printertypescript/cache/ReactNative-snapshot-image7479182449821973472.png`,
            {
              // imageWidth: 500,
              // imageHeight: 300,
            },
          );
          // let headerColumnAliment = [
          //   ColumnAliment.LEFT,
          //   ColumnAliment.RIGHT,
          // ];
          // let headerColumnWidth = [23 - (7),  7];
          // const headers = ['Uber', '#002cd'];
          // Printer.printColumnsText(headers, headerColumnWidth, headerColumnAliment, [
          //   `${BOLD_ON}${TXT_4SQUARE}`,`${TXT_4SQUARE}`,
          // ]);
          // Printer.printText(`${CENTER}Order placed: 03 Mar 2022 at 6:45pm${BOLD_OFF}`);
          // Printer.printText(`${CENTER}Pickup - 03 Mar 2022 at ${BOLD_OFF}\n`);
          // let reverseColumnAliment = [
          //   ColumnAliment.CENTER,
          // ];
          // let reverseColumnWidth = [46];
          // const reverse = ['8.30pm'];
          // Printer.printColumnsText(reverse, reverseColumnWidth, reverseColumnAliment, [
          //   `${BOLD_ON}${REVERSE}`,
          // ]);
          // Printer.printText(`\n${CENTER}${TXT_4SQUARE}STORE DELIVERY\n`);

          // let addressColumnAliment = [
          //   ColumnAliment.CENTER,
          // ];
          // let addressColumnWidth = [46];
          // const address = ['Unit 11, 328 Bath Road, Hounslow, TW4 7HW\n'];
          // Printer.printText(
          //   `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_80MM}${CENTER}`,
          // );
          // Printer.printColumnsText(address, addressColumnWidth, addressColumnAliment);
          // Printer.printText(`${CENTER}$Contact: +44132364340\n`);
          // Printer.printText(`${CENTER}Pin: 547347\n`);

          // Printer.printText(
          //   `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_80MM}${CENTER}`,
          // );

          // let orderList = [
          //   ['[1x]', 'Smoking patty special', `${POUND}10.97`],
          //   ['', ' | Choice of size', ''],
          //   ['', ' [1x] 80z', ''],
          //   ['', ' | Choice of Add-on', ''],
          //   ['', '[1x] Add premium potato chips, agarlic mayo dip & choice of drink', ''],
          //   ['', ' | Choice of Drinks', ''],
          //   ['', ' [1x] Fanta', ''],
          //   ['[1x]', 'Texas Ranch', '9.97'],
          //   ['', ' | Choice of size', ''],
          //   ['', ' [1x] 60z', ''],
          //   ['', ' | Choice of Add-on', ''],
          //   ['', '[1x] Add premium potato chips, agarlic mayo dip & choice of drink', ''],
          //   ['', ' | Choice of Drinks', ''],
          //   ['', ' [1x] Pepsi', ''],
          // ];

          // let columnAliment = [
          //   ColumnAliment.LEFT,
          //   ColumnAliment.LEFT,
          //   ColumnAliment.RIGHT,
          // ];
          // let columnWidth = [4, 46 - (4 + 12), 12];
          // // const header = ['Product list', 'Qty', 'Price'];
          // // Printer.printColumnsText(header, columnWidth, columnAliment, [
          // //   `${BOLD_ON}`,
          // //   '',
          // //   '',
          // // ]);
          // // Printer.printText(
          // //   `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
          // // );
          // for (let i in orderList) {
          //   Printer.printColumnsText(orderList[i], columnWidth, columnAliment, [
          //     `${BOLD_OFF}`,
          //     '',
          //     '',
          //   ]);
          // }
          // Printer.printText(`\n`);
          // Printer.printText(
          //   `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_80MM}${CENTER}`,
          // );
          // Printer.printText(`${CENTER}Order Notes\n`);
          // Printer.printText(`Please knock on the door when the driver arrives. Thanks!\n`);
          // Printer.printText(
          //   `${COMMANDS.HORIZONTAL_LINE.HR2_80MM}`,
          // );

          // let totalColumnAliment = [
          //   ColumnAliment.LEFT,
          //   ColumnAliment.RIGHT,
          // ];
          // let totalColumnWidth = [43 - (7),  7];
          // const total = [
          //   ['Subtotal:', '20.94'],
          //   ['Discount:', '2.30'],
          //   ['Total:', '18.64'],
          // ];
          // for (let i in total) {
          //   Printer.printColumnsText(total[i], totalColumnWidth, totalColumnAliment, [
          //     `${BOLD_OFF}`,
          //     '',
          //   ]);
          // }
          // Printer.printText(`${CENTER}Thank you for eating with`);
          // Printer.printText(`${CENTER}Smoking Patty (West Drayton)`);
          // Printer.printText(`${CENTER}67 Station Rd, West Drayton UB7 7LR`);
          // Printer.printText(`${CENTER}+44 1895 742235\n`);

          Printer.printBill(`${CENTER}Powered by Delivergate\n`, {beep: true});
        } else {
          // optional for android
          // android
          const Printer = printerList[selectedValue];
          // const encoder = new EscPosEncoder();
          // let _encoder = encoder
          //   .initialize()
          //   .align('center')
          //   .line('BILLING')
          //   .qrcode('https://nielsleenheer.com')
          //   .encode()
          // let base64String = Buffer.from(_encoder).toString('base64');
          // Printer.printRaw(base64String);
        }
      };
      getDataURL();
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePrintBillWithImage = async () => {
    const Printer: typeof NetPrinter = printerList[selectedValue];
    Printer.printImage(
      'https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/3a/bd/b5/the-food-bill.jpg',
      {
        imageWidth: 100,
        imageHeight: 100,
        paddingX: 100,
      },
    );
    Printer.printBill('', {beep: false});
  };

  const handleChangePrinterType = async (type: keyof typeof printerList) => {
    setSelectedValue(prev => {
      printerList[prev].closeConn();
      return type;
    });
    setSelectedPrinter({});
  };

  const findPrinter = () => {
    navigate('Find');
  };

  const onChangeText = (text: string) => {
    setSelectedNetPrinter({...selectedNetPrinter, host: text});
  };

  const _renderNet = () => (
    <>
      <Text style={[styles.text, {color: 'black', marginLeft: 0}]}>
        Your printer ip....
      </Text>
      <TextInput
        style={{
          borderBottomWidth: 1,
          height: 45,
        }}
        placeholder={'Your printer port...'}
        value={selectedNetPrinter?.host}
        onChangeText={onChangeText}
      />
      <View
        style={{
          marginTop: 10,
        }}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'grey', height: 30}]}
          // disabled={!selectedPrinter?.device_name}
          onPress={findPrinter}>
          <AntIcon name={'search1'} color={'white'} size={18} />
          <Text style={styles.text}>Find your printers</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const _renderOther = () => (
    <>
      <Text>Select printer: </Text>
      <Picker
        selectedValue={selectedPrinter}
        onValueChange={setSelectedPrinter}>
        {devices !== undefined &&
          devices?.length > 0 &&
          devices?.map((item: any, index) => (
            <Picker.Item
              label={item.device_name}
              value={item}
              key={`printer-item-${index}`}
            />
          ))}
      </Picker>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View>
        <View
          collapsable={false}
          ref={viewRef}
          style={{backgroundColor: 'white'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              width: '43%',
            }}>
            <Text
              style={{
                width: '65%',
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'left',
                // paddingBottom: 20,
                backgroundColor: 'white',
                color: 'black',
              }}>
              {data.delivery_platform_name}
            </Text>
            <Text
              style={{
                width: "32%",
                fontSize: 25,
                fontWeight: '700',
                textAlign: 'right',
                color: 'black',
                backgroundColor: 'white',
              }}>
              {data.display_order_id}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              Order placed: {data.created_date_time}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              Pickup - {data.delivery_date} at
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'black',
              padding: 10,
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'white',
              }}>
              {data.delivery_time}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 30,
                fontWeight: '400',
                textAlign: 'center',
                color: 'black',
              }}>
              {data.delivery_type}
            </Text>
          </View>
          {data.payment_method != '' && data.payment_method != null && (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '43%',
                backgroundColor: 'black',
              }}>
              <Text
                style={{
                  width: '100%',
                  fontSize: 30,
                  fontWeight: '400',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {data.payment_method}
              </Text>
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              {data?.delivergate_customer?.address}
            </Text>
          </View>
          <View
            style={{
              width: '43%',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                color: 'black',
                textAlign: 'center',
              }}>
              *************************************************************
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              {data?.delivergate_customer?.first_name +
                ' ' +
                data?.delivergate_customer?.last_name}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              Contact: {data?.delivergate_customer?.phone}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              width: '43%',
              backgroundColor: 'white',
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                textAlign: 'center',
                color: 'black',
              }}>
              Pin: {data?.delivergate_customer?.contact_access_code}
            </Text>
          </View>
          <View
            style={{
              width: '43%',
              paddingTop: 5,
            }}>
            <Text
              style={{
                width: '100%',
                fontSize: 16,
                color: 'black',
                textAlign: 'center',
              }}>
              *************************************************************
            </Text>
          </View>
          <FlatList
            data={data.items}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item.id}
            renderItem={({item, index}) => {
              return (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '43%',
                      backgroundColor: 'white',
                      paddingTop: 5
                    }}>
                    <View style={{width: '10%'}}>
                      <Text
                        style={{
                          width: '100%',
                          fontSize: 16,
                          textAlign: 'left',
                          color: 'black',
                        }}>
                        [{item.quantity}x]
                      </Text>
                    </View>
                    <View style={{width: '60%'}}>
                      <Text
                        style={{
                          width: '100%',
                          fontSize: 16,
                          // textAlign: 'center',
                          color: 'black',
                          fontWeight: 'bold',
                        }}>
                        {item.item_name}
                      </Text>
                    </View>
                    <View style={{width: '30%'}}>
                      <Text
                        style={{
                          width: '100%',
                          fontSize: 16,
                          textAlign: 'right',
                          color: 'black',
                        }}>
                        £ {((item.total / 100) * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {item.modifiers.length > 0 ? (
                    <>
                      <FlatList
                        data={item?.modifiers}
                        renderItem={({item, index}) => {
                          return (
                            <>
                              <View
                                style={{
                                  // alignItems: 'center',
                                  flexDirection: 'row',
                                  // justifyContent: 'center',
                                  width: '43%',
                                  backgroundColor: 'white',
                                  paddingTop: 5,
                                }}>
                                <View style={{width: '10%'}}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      fontSize: 16,
                                      textAlign: 'left',
                                      color: 'black',
                                    }}></Text>
                                </View>
                                <View style={{width: '60%'}}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      fontSize: 16,
                                      // textAlign: 'center',
                                      color: 'black',
                                      paddingLeft: 5,
                                      fontWeight: 'bold',
                                    }}>
                                    | {item?.title}
                                  </Text>
                                </View>
                                <View style={{width: '30%'}}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      fontSize: 16,
                                      textAlign: 'right',
                                      color: 'black',
                                    }}></Text>
                                </View>
                              </View>
                              <>
                                <FlatList
                                  data={item?.selected_item}
                                  renderItem={({item, index}) => {
                                    return (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          width: '43%',
                                        }}>
                                        <View style={{width: '10%'}}>
                                          <Text
                                            style={{
                                              width: '100%',
                                              fontSize: 16,
                                              textAlign: 'left',
                                              color: 'black',
                                            }}></Text>
                                        </View>
                                        <View style={{width: '60%'}}>
                                          <Text
                                            style={{
                                              width: '100%',
                                              fontSize: 16,
                                              paddingLeft: 5,
                                              color: 'black',
                                            }}>
                                            [{parseInt(item?.quantity)}x]{' '}
                                            {item.title}
                                          </Text>
                                        </View>
                                        <View style={{width: '30%'}}>
                                          <Text
                                            style={{
                                              width: '100%',
                                              fontSize: 16,
                                              textAlign: 'right',
                                              color: 'black',
                                            }}></Text>
                                        </View>
                                      </View>
                                    );
                                  }}
                                />
                              </>
                            </>
                          );
                        }}
                      />
                    </>
                  ) : null}
                </View>
              );
            }}
          />
        </View>
        <TouchableOpacity style={{marginTop: 30}} onPress={shareDummyImage}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              color: 'red',
            }}>
            {showInstagramStory ? 'Share Instagram Story' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* <ShareableReactImage /> */}
        {/* Printers option */}
        <View style={styles.section}>
          <Text style={styles.title}>Select printer type: </Text>
          <Picker
            selectedValue={selectedValue}
            mode="dropdown"
            onValueChange={handleChangePrinterType}>
            {Object.keys(printerList).map((item, index) => (
              <Picker.Item
                label={item.toUpperCase()}
                value={item}
                key={`printer-type-item-${index}`}
              />
            ))}
          </Picker>
        </View>
        {/* Printers List */}
        <View style={styles.section}>
          {selectedValue === 'net' ? _renderNet() : _renderOther()}
          {/* Buttons Connect */}
          <View
            style={[
              styles.buttonContainer,
              {
                marginTop: 50,
              },
            ]}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleConnectSelectedPrinter}>
              <AntIcon name={'disconnect'} color={'white'} size={18} />
              <Text style={styles.text}>Connect</Text>
            </TouchableOpacity>
          </View>
          {/* Button Print sample */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'blue'}]}
              onPress={handlePrint}>
              <AntIcon name={'printer'} color={'white'} size={18} />
              <Text style={styles.text}>Print sample</Text>
            </TouchableOpacity>
          </View>
          {/* Button Print bill */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'blue'}]}
              onPress={handlePrintBill}>
              <AntIcon name={'profile'} color={'white'} size={18} />
              <Text style={styles.text}>Print bill</Text>
            </TouchableOpacity>
          </View>
          {/* Button Print bill With Image */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'blue'}]}
              onPress={handlePrintBillWithImage}>
              <AntIcon name={'profile'} color={'white'} size={18} />
              <Text style={styles.text}>Print bill With Image</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.qr}>
            <QRCode value="hey" getRef={(el: any) => (QrRef = el)} />
          </View>
        </View>

        {/* <Loading loading={loading} /> */}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {},
  rowDirection: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    height: 40,
    width: deviceWidth / 1.5,
    alignSelf: 'center',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  qr: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  dummy: {
    width: 0,
    height: 0,
    borderTopWidth: 120,
    borderTopColor: 'yellow',
    borderLeftColor: 'black',
    borderLeftWidth: 120,
    borderRightColor: 'black',
    borderRightWidth: 120,
    borderBottomColor: 'yellow',
    borderBottomWidth: 120,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
    borderBottomRightRadius: 120,
    borderBottomLeftRadius: 120,
  },
});
