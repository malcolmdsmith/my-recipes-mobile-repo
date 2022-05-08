import { AsyncStorage } from "@react-native-async-storage/async-storage";

const store = async (key, value) => {
    await AsyncStorage.setItem(key, value);
}

const get = async(key) => {
    return await AsyncStorage.getItem(key);
}

export default {
    store,
    get
}