import React, {useEffect} from 'react';
import './App.css';
import API from "./api";
import DataContext, {useAppData} from "./data";
import Splash from "./components/Splash";
import {HashRouter, Route} from "react-router-dom";
import MainScreen from "./components/MainScreen";
import Div100vh from "react-div-100vh";
import moment from "moment";
import 'moment/locale/ru'
import OrderScreen from "./components/OrderScreen";


function App() {
    const appData = useAppData()


    useEffect(()=>{
        appData.fetchAll()
        moment.locale('ru')
    },[])

    return <Div100vh style={{overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f7f7f7'}}>
        <div style={{maxWidth: 400, backgroundColor: 'white', flex: 1}}>
            <DataContext.Provider value={appData}>
                <Splash isVisible={!appData.isLoaded}/>
                <HashRouter>
                    <Route exact path={'/'} component={MainScreen}/>
                    <Route path={'/order/:id'} component={OrderScreen}/>
                </HashRouter>
            </DataContext.Provider>
        </div>
    </Div100vh>
}

window.api = API

export default App;
