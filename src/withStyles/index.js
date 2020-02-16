import React, {Component} from 'react'

const withStyles = (WrappedComponent,classes) => {
    return class extends Component {
        componentDidMount(){
            const style = document.getElementsByTagName('style')[0]
            style.innerHTML += classes
        }
        render(){
            return (<WrappedComponent />)
        }
    }
}
export default withStyles