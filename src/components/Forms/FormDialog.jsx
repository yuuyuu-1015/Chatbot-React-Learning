// import React from "react";
// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import TextInput from "./TextInput";

// export default class FormDialog extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "",
//       email: "",
//       description: "",
//     };

//     this.inputName = this.inputName.bind(this);
//     this.inputEmail = this.inputEmail.bind(this);
//     this.inputDescription = this.inputDescription.bind(this);
//   }

//   inputName = (event) => {
//     this.setState({ name: event.target.value });
//   };
//   inputEmail = (event) => {
//     this.setState({ email: event.target.value });
//   };
//   inputDescription = (event) => {
//     this.setState({ description: event.target.value });
//   };

//   submitForm = () => {
//     const name = this.state.name;
//     const email = this.state.email;
//     const description = this.state.description;

//     const payload = {
//         text: "お問い合わせあり\n" +
//                 "お名前：" + name + "\n"+
//                 "Email：" + email + "\n"+
//                 " 問い合わせ内容：\n" + description + "\n"+

//     }

//     const url = "https://hooks.slack.com/services/"

//     fetch({
//         method: "POST",
//         body: JSON.stringify(payload)
//     }).then(() => {
//         alert("送信完了")
//         this.setState({
//             name: "",
//             email: "",
//             description: "",
//         })
//         return this.props.handleClose()
//     })
//   };

//   render() {
//     return (
//       <div>
//         <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//           Open alert dialog
//         </Button>
//         <Dialog
//           open={this.props.open}
//           onClose={this.props.handleClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">
//             お問い合わせフォーム
//           </DialogTitle>
//           <DialogContent>
//             <TextInput
//               label={"お名前（必須）"}
//               multiline={false}
//               rows={1}
//               value={this.state.name}
//               type={"text"}
//               onChange={this.inputName}
//             />
//             <TextInput
//               label={"メールアドレス"}
//               multiline={false}
//               rows={1}
//               value={this.state.email}
//               type={"text"}
//               onChange={this.inputEmail}
//             />
//             <TextInput
//               label={"内容"}
//               multiline={false}
//               rows={5}
//               value={this.state.description}
//               type={"text"}
//               onChange={this.inputDescription}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={this.props.handleClose} color="primary">
//               キャンセル
//             </Button>
//             <Button onClick={this.submitForm} color="primary" autoFocus>
//               送信
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     );
//   }
// }

import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextInput } from "./index";

const FormDialog = (props) => {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Functions triggered by inputting text value
  const inputDescription = useCallback(
    (event) => {
      setDescription(event.target.value);
    },
    [setDescription]
  );

  const inputEmail = useCallback(
    (event) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const inputName = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [setName]
  );

  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  };

  const validateRequiredInput = (...args) => {
    let isBlank = false;
    for (let i = 0; i < args.length; i = (i + 1) | 0) {
      if (args[i] === "") {
        isBlank = true;
      }
    }
    return isBlank;
  };

  // Slackに問い合わせがあったことを通知する
  const submitForm = () => {
    const isBlank = validateRequiredInput(name, email, description);
    const isValidEmail = validateEmailFormat(email);

    if (isBlank) {
      alert("必須入力欄が空白です。");
      return false;
    } else if (!isValidEmail) {
      alert("メールアドレスの書式が異なります。");
      return false;
    } else {
      const payload = {
        text:
          "お問い合わせがありました\n" +
          "お名前: " +
          name +
          "\n" +
          "メールアドレス: " +
          email +
          "\n" +
          "【問い合わせ内容】\n" +
          description,
      };

      // fetchメソッドでフォームの内容をSlackのIncoming Webhook URL に送信する
      const WEBHOOK_URL =
        "https://hooks.slack.com/services/";
      fetch(WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      }).then(() => {
        alert("送信が完了しました。追ってご連絡いたします🙌");
        setDescription("");
        setEmail("");
        setName("");
        return props.handleClose();
      });
    }
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>お問い合わせフォーム</DialogTitle>
      <DialogContent>
        <TextInput
          label={"名前(必須)"}
          multiline={false}
          rows={1}
          value={name}
          type={"text"}
          onChange={inputName}
        />
        <TextInput
          label={"メールアドレス(必須)"}
          multiline={false}
          rows={1}
          value={email}
          type={"email"}
          onChange={inputEmail}
        />
        <TextInput
          label={"お問い合わせ内容(必須)"}
          multiline={true}
          rows={5}
          value={description}
          type={"text"}
          onChange={inputDescription}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          キャンセル
        </Button>
        <Button onClick={submitForm} color="primary">
          送信する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
