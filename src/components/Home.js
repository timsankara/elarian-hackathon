import React, { Component } from "react";
import { fetchCountyByName, fetchCounties } from '../util/counties_dynamo'

class Home extends Component {

    async componentDidMount() {
        await fetchCounties()
            .then(counties => {
                console.log(counties)
            })
            .catch(err => {
                console.log(err)
            })
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-6 mx-auto">
                        <h1 className="text-center">
                            Home
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

// fetchCounties2