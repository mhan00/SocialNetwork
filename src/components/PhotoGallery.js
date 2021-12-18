import React, {useEffect, useState} from 'react';
import Gallery from 'react-grid-gallery'
import PropTypes from 'prop-types'
import {DeleteOutlined} from '@ant-design/icons'
import {BASE_URL, TOKEN_KEY} from "../constants";
import axios from "axios";
import {Button} from "antd";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
};

const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
};

function PhotoGallery (props) {
    const[images,setImages]=useState(props.images)
    const[curImgIdx,setCurImgInx]=useState(0)

    const imageArr=images.map(image =>{
        return {
            ...image,//保留image属性
            customOverlay:(
                <div>
                    <div>{ `${image.user}:${image.caption}`}</div>
                </div>
            )

        }
    })
    const onDeleteImage=()=> {
        if (window.confirm(`Are you sure you want to delete this image?`)) {
            //step 1:get the image to be deleted
            //step 2: remove the image from image array
            //step 3: send delete request to the server

            const curImg = images[curImgIdx];
            const newImageArr = images.filter((img, index) => index !== curImgIdx);
            console.log('delete image ', newImageArr);
            setImages(newImageArr);
//             const opt = {
//                 method: 'DELETE',
//                 url: `${BASE_URL}/post/${curImg.postId}`,
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
//                 }
//             };
//     axios(opt)
//         .then( res => {
//             console.log('delete result -> ', res);
//             // case1: success
//             if(res.status === 200) {
//                 // step1: set state
//                 setImages(newImageArr);
//             }
//         })
//         .catch( err => {
//             // case2: fail
//             message.error('Fetch posts failed!');
//             console.log('fetch posts failed: ', err.message);
//         })
// }
        }
    }

const onCurrentImageChange=index=>{
        console.log(index+'clicked!')
        setCurImgInx(index);
    }
    useEffect(() => {
        setImages(props.images)
    }, [props.images])
    return (
            <div type={{wrapperStyle}}>
                <Gallery
                    images={imageArr}
                    enableImageSelection={false}
                    backdropClosesModal={true}
                    currentImageWillChange={onCurrentImageChange}
                    customControls={[
                        <Button style={{marginTop: "10px", marginLeft: "5px"}}
                                key="deleteImage"
                                type="primary"
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={onDeleteImage}
                        >Delete Image</Button>
                    ]}
                />
            </div>
        );
    }

PhotoGallery.prototype={ //校验image type
    images:PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            user: PropTypes.string.isRequired,
            caption: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight:PropTypes.number.isRequired
        })
    ).isRequired
}
export default PhotoGallery;