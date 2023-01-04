import React from "react"

export default function Intro(props){
    return (

        <div className="Intro text-center">
            <div className="container">
                <div className="logo intro">
                    <img alt="logo" src="/assets/wheels-app-logo.gif"></img>
                </div>
                <div>
                    <img alt="logo" className="logotype" src="/assets/wa-logotype.svg"></img>
                </div>
                <div className="button" onClick={props.goToForm}>Let's go!</div>
            </div>
        </div>

    )
}
