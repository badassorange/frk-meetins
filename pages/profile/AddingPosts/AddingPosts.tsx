import React, { useRef, useState } from "react";
import s from "./AddingPosts.module.scss";
import Image from "next/image";
import like from "../../../public/images/interesting.svg";
import { useStore } from "effector-react";
import { $currentProfileUser, sendNewUserPost } from "../../../global/store/store";

export default function AddingPosts(): JSX.Element {
    
    const currentUser = useStore($currentProfileUser);
    const ref = useRef(null);
    
    const [addMode, setAddMode] = useState(true);
    const [postFormData, setPostFormData] = useState({ title: "", description: "", currentFile: null });

    const chooseFile = () => {
        ref.current.click();
    }
    const sendNewPost = () => {
        const formData = new FormData();
        formData.append('title', postFormData.title);
        formData.append('description', postFormData.description);
        formData.append('uploadedFile', postFormData.currentFile);

        sendNewUserPost(formData);
    }
    return(
        <div className={s.addingPosts}>
            {
                addMode && 
                <div className={s.addingPostsForm}>
                    <div className={s.addingPostsFormMain}>
                        <input 
                            type="text" 
                            placeholder="Название поста" 
                            onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                        />
                        <a className={s.addingPostsFormMainFile} onClick={chooseFile}>
                            Нажмите чтобы добавить изображение к вашей публикации 
                            (Загружено {postFormData.currentFile ? 1 : 0} / 1)
                            <input 
                                ref={ref} 
                                type="file" 
                                onChange={(e) => setPostFormData({ ...postFormData, currentFile: e.target.files[0] })}
                            />
                        </a>
                    </div>
                    <div className={s.addingPostsFormDescription}>
                        <textarea 
                            placeholder="Введите описание к посту"
                            onChange={(e) => setPostFormData({ ...postFormData, description: e.target.value })}
                        />
                        <button onClick={sendNewPost}>Добавить</button>
                    </div>
                </div>
            } 
        </div>
    )
}