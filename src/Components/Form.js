import React from "react"
import axios from "axios"


export default function Form(props){

const [airports, setAirports] = React.useState([])
const [airlines, setAirlines] = React.useState([])
const [airportsDepartureMatches, setAirportsDepartureMatches] = React.useState([])
const [airportsArrivalMatches, setAirportsArrivalMatches] = React.useState([])
const [airlinesMatches, setAirlinesMatches] = React.useState([])

const [showDropdown, setShowDropdown] = React.useState({showDropdownDep: false, showDropdownArr: false, showDropdownAirline: false})


React.useEffect(() => {
    const loadAirports = async () => {
        const response = await axios.get('https://raw.githubusercontent.com/konsalex/Airport-Autocomplete-JS/master/src/data/airports.json')
        setAirports(response.data)
    }
    loadAirports()

    const loadAirlines = async () => {
        const response = await axios.get('https://raw.githubusercontent.com/npow/airline-codes/master/airlines.json')
        setAirlines(response.data)
    }
    loadAirlines()
}, [])

const searchDepartureAirports = (text) => {
    if(text === " "){
        setAirportsDepartureMatches([])
    } else {
        // filtering the results with filter and a regex
        let matches = airports.filter((airport) => {
            // RegExp accepts text to search and flags (g - global and i -case insensitive) as parameters
            const toFind = new RegExp(`${text}`, "gi")
            return airport.city.match(toFind) || airport.IATA.match(toFind) || airport.country.match(toFind)|| airport.name.match(toFind)
        })
        setAirportsDepartureMatches(matches)
        console.log(props.formData.departureIATA)    
    }
}

const searchArrivalAirports = (text) => {
    if(text === " "){
        setAirportsArrivalMatches([])
    } else {
        // filtering the results with filter and a regex
        let matches = airports.filter((airport) => {
            // RegExp accepts text to search and flags (g - global and i -case insensitive) as parameters
            const toFind = new RegExp(`${text}`, "gi")
            return airport.city.match(toFind) || airport.IATA.match(toFind) || airport.country.match(toFind)|| airport.name.match(toFind)
        })
        setAirportsArrivalMatches(matches)
    }
}


const searchAirlineCode = (text) => {
    if(text === " "){
        setAirlinesMatches([])
    } else {
        // filtering the results with filter and a regex
        let matches = airlines.filter((airline) => {
            // RegExp accepts text to search and flags (g - global and i -case insensitive) as parameters
            const toFind = new RegExp(`${text}`, "gi")
            return airline.name.match(toFind) || airline.country.match(toFind) || airline.iata.match(toFind)
        })
        setAirlinesMatches(matches)
    }
}

const changeInputDepValue = (selected) => {
    let depInput = document.getElementById("form-dep-input")
    depInput.value = selected;
}

const changeInputArrValue = (selected) => {
    let depInput = document.getElementById("form-arr-input")
    depInput.value = selected;
}

const changeInputAirlineValue = (selected) => {
    let depInput = document.getElementById("form-airline-input")
    depInput.value = selected;
}

let show = {display: "block"}
let hidden = {display: "none"}


    return (

        <div className="Form text-center fade-in-image">
            <div className="container">
                <div className="logo">
                    <img alt="logo" src="/assets/wheels-app-logo.gif"></img>
                </div>
                <div className="fields">

                    <input
                    id="form-dep-input"
                    placeholder="departure airport" name="departureIATA"
                    onChange={(e) => searchDepartureAirports(e.target.value)}
                    // closes all other dropdowns
                    onClick={() => setShowDropdown(prevShowDropdown => ({
                        showDropdownDep: !prevShowDropdown.showDropdownDep,
                        showDropdownArr: false,
                        showDropdownAirline: false
                    }))}
                    />
                    
                    {/* // and every other dropdown is hidden */}

                    <div className="dropdown" style={showDropdown.showDropdownDep ? show : hidden} >
                        <div className="scroll">
                                {airportsDepartureMatches.map((airport, index) => {
                                    // only show entries with IATA code
                                    let charIsLetter = (char) => {
                                        if (typeof char !== 'string') {
                                            return false;
                                        }
                                        return /^[a-zA-Z]+$/.test(char);
                                    }
                                    
                                    if(charIsLetter(airport.IATA)){

                                        return (
                                            <div className="option" key={index}
                                                onClick={() => {props.handleDepartureCode(airport.IATA); setAirportsDepartureMatches([]); changeInputDepValue(airport.IATA)}}>
                                                    {/* only closes THIS dropdown */}
                                                <p>{airport.city}</p>
                                                <p>{airport.IATA}, {airport.name}</p>
                                                <p>{airport.country}</p>
                                            </div>
                                    )}

                                })}
                        </div>
                    </div>

                    <input placeholder="arrival airport"
                    id="form-arr-input"
                    name="arrivalIATA"
                    onChange={(e) => searchArrivalAirports(e.target.value)}
                    onClick={() => setShowDropdown(prevShowDropdown => ({
                        showDropdownDep: false,
                        showDropdownArr: !prevShowDropdown.showDropdownArr,
                        showDropdownAirline: false
                    }))}                    
                    />
                    
                    <div className="dropdown" style={showDropdown.showDropdownArr ? show : hidden} >
                        <div className="scroll">
                            {airportsArrivalMatches.map((airport, index) => {
                                    // only show entries with IATA code
                                    let charIsLetter = (char) => {
                                        if (typeof char !== 'string') {
                                            return false;
                                        }
                                        return /^[a-zA-Z]+$/.test(char);
                                    }
                                    
                                    if(charIsLetter(airport.IATA)){
                                        return (
                                            <div className="option" key={index}
                                                onClick={() => {props.handleArrivalCode(airport.IATA); setAirportsArrivalMatches([]); changeInputArrValue(airport.IATA)}}>
                                                <p>{airport.city}</p>
                                                <p>{airport.IATA}, {airport.name}</p>
                                                <p>{airport.country}</p>
                                            </div>  
                                    )}

                            })}
                        </div>
                    </div>

                    <input placeholder="airline"
                    name="airlineCode"
                    id="form-airline-input"
                    onChange={(e) => searchAirlineCode(e.target.value)}
                    onClick={() => setShowDropdown(prevShowDropdown => ({
                        showDropdownDep: false,
                        showDropdownArr: false,
                        showDropdownAirline: !prevShowDropdown.showDropdownAirline
                    }))}
                    />
                    
                    <div className="dropdown" style={showDropdown.showDropdownAirline ? show : hidden} >
                        <div className="scroll">
                            {airlinesMatches.map((airline, index) => {

                                let charIsLetter = (char) => {
                                    if (typeof char !== 'string') {
                                        return false;
                                    }
                                    return /^[a-zA-Z]+$/.test(char);
                                }

                                console.log(airline.iata)

                                if(charIsLetter(airline.iata)){
                                    return (
                                        <div className="option" key={index}
                                            onClick={() => {props.handleAirlineIata(airline.iata); setAirlinesMatches([]); changeInputAirlineValue(airline.name)}}>
                                            <p>{airline.name}</p>
                                            <p>{airline.country}</p>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>

                </div>

                <div className="button" onClick={props.handleSubmit}>
                    Track my flight
                </div>
                
            </div>
        </div>

    )
}