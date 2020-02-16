import React, { Component } from "react";
import withStyles from "../withStyles";
const styles = `
    .sortable li {
        list-style: none;
        float: left;
        width: 250px;
        height: 500px;
        margin-right: 50px;
        background: #f5f5f5;
        border-radius: 10px;
        overflow: auto;
    }
    .sortable .wrapper{
        float: left;
        margin-right: 50px;
        width: 250px;
        height: 500px;
        position: relative;
    }
    .sortable button {
        outline: none;
        width: 70px;
        height: 20px;
        font-size: 16px;
        line-height: 20px;
        background: #87CEFA;
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        bottom: 0px;
        border-radius: 5px;
    }
    .sortable .card {
        width: 90%;
        height: 80px;
        margin: 20px 12px;
        background: #fff;
        border-radius: 8px;
    }
    `;

class Sortable extends Component {
  constructor() {
    super();
    this.state = {
      i: 0,
      finalState: "first"
    };
  }
  
  componentDidMount() {
    //事件委托
    this.refs.ul.ondblclick = event => {
      if (event.target.tagName === "DIV") {
        this.dialog(document.getElementById(event.target.id));
      }
    }
    this.refs.ul.ondragstart = event => {
      if (event.target.tagName === "DIV") {
        this.drag(event);
      }
    }
    this.refs.ul.ondragover = event => {
      if (event.target.tagName === "LI") {
        this.allowDrop(event);
      }
    }
    this.refs.ul.ondrop = event => {
      if (event.target.tagName === "LI") {
        this.drop(event);
      }
    }
    //实现弹窗
    let div = document.createElement("div"),
      p = document.createElement("p"),
      textarea = document.createElement("textarea"),
      btn1 = document.createElement("button"),
      btn2 = document.createElement("button");

    p.innerHTML = "请输入详情";
    btn1.innerHTML = "确定";
    btn2.innerHTML = "取消";
    div.appendChild(p);
    div.appendChild(textarea);
    div.appendChild(btn1);
    div.appendChild(btn2);
    div.style.cssText = `
      border: 1px solid #3e3e3e;
      border-radius: 10px;
      width: 500px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      background: #f5f5f5;
    `;
    textarea.style.cssText = `
        font-size: 16px;
        resize: none;
        width: 100%;
        height: 80px;
        border: none;
        box-sizing: border-box;
        outline: none;
    `;
    btn1.style.cssText = `
        margin-left: 100px;
        width: 50px;
        background: #87CEFA;
        border-radius: 5px;
    `;
    btn2.style.cssText = `
        margin-left: 200px;
        width: 50px;
        background: #87CEFA;
        border-radius: 5px;
    `;
    this.div = div;
    this.textarea = textarea;
    btn2.onclick = () => {
      this.div.parentNode.removeChild(this.div);
    }
    this.btn1 = btn1;
    this.btn2 = btn2;
  }

  dialog() {
      this.setState({
          finalState: 'first'
      })
    if (arguments[0].tagName) {
      this.textarea.value = arguments[0].innerText;
      document.getElementsByTagName("body")[0].appendChild(this.div);
      this.btn1.onclick = () => {
        arguments[0].innerText = this.textarea.value;
        this.div.parentNode.removeChild(this.div);
      };
    } else {
      this.textarea.value = "";
      document.getElementsByTagName("body")[0].appendChild(this.div);

      this.btn1.onclick = () => {
        this.setState(
          {
            i: this.state.i + 1
          },
          () => {
            let card = document.createElement("div");
            card.className = "card";
            card.id = "task-" + this.state.i;
            card.innerText = this.textarea.value;
            card.draggable = "true";
            this.refs.first.appendChild(card);
            this.div.parentNode.removeChild(this.div);
          }
        );
      };
    }
  }

  drag(ev) {
    ev.dataTransfer.setData("child", ev.target.id);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("child");
    ev.target.appendChild(document.getElementById(data));

    if (this.refs.first.children.length === 0) {
      if (this.refs.second.children.length === 0) {
        if (this.refs.third.children.length === 0) {
          if (this.state.finalState !== "first") {
            this.setState({
              finalState: "first"
            });
          }
        } else {
          this.setState({
            finalState: "third"
          });
        }
      } else {
        if (this.state.finalState !== "second") {
          this.setState({
            finalState: "second"
          });
        }
      }
    } else {
      if (this.state.finalState !== "first") {
        this.setState({
          finalState: "first"
        });
      }
    }
  }

  render() {
    return (
      <div className="sortable">
        <ul ref="ul">
          <div className="wrapper">
            <li ref="first"></li>
            <button ref="add" onClick={this.dialog.bind(this)}>add</button>
          </div>

          <li ref="second"></li>
          <li ref="third"></li>
        </ul>
      </div>
    );
  }

  componentWillUnmount(){
    this.refs.ul.ondblclick = null
    this.refs.ul.ondragstart = null
    this.refs.ul.ondragover = null
    this.refs.ul.ondrop = null
    this.btn1.onclick = null
    this.refs.add.onclick = null
    this.btn2.onclick = null
  }
}

export default withStyles(Sortable, styles);
