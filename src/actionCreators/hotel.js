import { api } from '../api/';
import actionTypes from '../actionTypes/hotel';

const actions = {
    getAvailableRate: () => {
        return (dispatch, store) => {
            dispatch(actions.loadingRate(true));
            const { hotelId, checkIn, numNights } = store().hotel.formRate
            const resultCheckin = actions.validateParams("checkIn", checkIn)
            const resultNumNights = actions.validateParams("numNights", numNights)
            console.log(resultNumNights)
            console.log(resultCheckin)

            if (resultNumNights === -1) {
                dispatch(actions.fetchRateResponse(-1));
            } else if (resultCheckin === -2) {
                dispatch(actions.fetchRateResponse(-2));
            } else {
                api.getAvailableRate(hotelId, checkIn, numNights).then(response => {
                    if (response.hasOwnProperty("availableRates")) {
                        dispatch(actions.fetchLowestRate(response.availableRates[hotelId][0]));
                        dispatch(actions.fetchRates(response.availableRates[hotelId]));
                        dispatch(actions.fetchRateResponse(true));
                    } else {
                        console.log("error: " + response.message)
                        dispatch(actions.fetchRateResponse(false));
                    }
                    dispatch(actions.loadingRate(false));
                }, reason => {
                    if (reason.message === 400) {
                        // !Rate
                        console.log(reason.message)
                    } else {
                        //TODO: Falló otra cosa
                        console.log(reason.message)
                    }
                    dispatch(actions.fetchRateResponse(false));
                    dispatch(actions.loadingAuthors(false));
                });
            }
        }
    },
    validateParams: (key, value) => {
        switch (key) {
            case 'numNights':
                if (value < 0 || value > 30) {
                    return -1
                } else {
                    return value
                }
                break
            case 'checkIn':
                let actualDate = new Date()
                if (value < actualDate) {
                    return -2
                } else {
                    return value
                }
        }

    },
    setFormRate: (key, value) => {
        if (key === 'checkin') {
            var fecha = new Date(value);
            value = fecha.toLocaleDateString('en-GB')
        }
        return {
            type: actionTypes.SET_FORM_RATE,
            payload: {
                key,
                value
            }
        };
    },
    fetchLowestRate: (data) => ({
        type: actionTypes.FETCH_LOWEST_RATE,
        payload: {
            data
        }
    }),
    fetchRates: (data) => ({
        type: actionTypes.FETCH_RATES,
        payload: {
            data
        }
    }),
    fetchRateResponse: (value) => ({
        type: actionTypes.FETCH_RATE_RESPONSE,
        payload: {
            value
        }
    }),
    loadingRate: (status) => ({
        type: actionTypes.LOADING_RATE,
        payload: {
            status
        }
    }),

};

export default actions;