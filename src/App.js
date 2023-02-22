import React, { useState, useEffect } from 'react';
import axios from "axios"
import "./Style.css"
//import {getMemo, addMemo, editMemo, deleteMemo} from "./CRUD.js"

const App = () => {
    // 백엔드 서버 기본 주소
    const serverURL = "http://127.0.0.1:5001";
    //console.log(`${serverURL}/delete/${a}`);
    
    // 기본 메모 데이터
    const [memo, SetMemo] = useState([]);

    // 추가 input 데이터
    const [inputMemo, SetInputMemo] = useState("");

    // 초기에 서버로 부터 데이터 가져오기
    useEffect(() => {
        axios.get(serverURL)
        .then((response) => {
            const data = response.data;
            SetMemo(data);
            console.log("초기화 성공");
        })
    }, []);

    /*========조회, 추가, 편집, 삭제 함수들========*/
    const getMemo = () => {
        axios.get(serverURL)
        .then((response) => {
            const data = response.data;
            SetMemo(data);
            console.log("메모 가져오기 성공");
        });
    };

    const addMemo = (new_content) => {
        if (new_content.trim() !== '' && new_content !== null){
            axios.post(`${serverURL}/add/${new_content}`)
        .then((response) => {
            console.log(response.data);
            SetInputMemo("");
            getMemo();
        });
        }
    };

    const editMemo = (id, content) => {
        //console.log();
        axios.put(`${serverURL}/update`, {
            "id" : id,
            "content" : content
          })
        .then((response) => {
            console.log(response.data);
            getMemo();
        });
    };

    const deleteMemo = (id) => {
        axios.delete(`${serverURL}/delete?id=${id}`)
        .then((response) => {
            console.log(response);
            getMemo();
        });
    };

    /*========편집모드를 포함하는 Content 박스========*/
    const DataBox = (props) => {
        const [isEditmode, setEditmode] = useState(false);
        const [editContent, setEditContent] = useState(props.item.content);
        //const current_content = props.item.content;
        return (isEditmode ? 
            <div className="content_box--wrapper change">
                <input className="change_content" type="text" placeholder={editContent} 
                onChange={(e) => {
                    const current_input = e.target.value;
                    if (current_input.trim() !== '' && current_input !== editContent) {
                        setEditContent(current_input);
                    }else {
                        alert("재입력하시오.");
                    }
                    }}/>
                <button className="change_btn" onClick={() => {
                    editMemo(props.item.id, editContent);
                    setEditmode((current => !current));
                }}>변경</button>
            </div>
            : 
            <div className="content_box--wrapper" key={props.item.id}>
                <div className="content_box">{editContent}</div>
                <button className="edit_btn" onClick={
                    () => {
                    setEditmode((current => !current));
                    }
                }><img className="edit_btn_image" alt='is_edit_btn' src="img/edit_btn.svg"/></button>
                <button className="delete_btn" onClick={() => {deleteMemo(props.item.id);
                }}><img className="delete_btn_image" alt='is_delete_btn' src="img/delete_btn.svg"/></button>
            </div>
            );

    }

    return (
        <div className="wrapper">
            <div className="content--wrapper">
                <div id="input--area" className="input--wrapper">
                    <input className="input_box" type="text" size="30" placeholder="내용 입력" onChange={(e) => {const current_input = e.target.value;
                    SetInputMemo(current_input);}} value={inputMemo}/>
                    <button className="add_btn" onClick={() => addMemo(inputMemo)}>추가</button>
                </div>
                <div id="content--area" className="content_area--wrapper">
                    {memo.map((item) => {
                        return (<DataBox key={item.id} item={item}/>);
                    })}
                </div>
        </div>
    </div>
    );
}

export default App;