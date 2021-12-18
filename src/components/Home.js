import React, {useEffect, useState} from 'react';
import SearchBar from "./SearchBar";
import { Tabs, message, Row, Col, Button } from "antd";
import{SEARCH_KEY,BASE_URL,TOKEN_KEY} from "../constants";
import axios from "axios";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";


const {TabPane}=Tabs;
function Home(props) {
    const [activeTab,setActiveTab]=useState("image");
    const[posts,setPosts]=useState([]);
    const[searchOption,setSearchOption]=useState({
        type:SEARCH_KEY.all,
        keyword:""
    });

    const handleSearch = (option) => {
        const { type, keyword } = option;
        setSearchOption({ type: type, keyword: keyword });
    };

    const showPost = (type) => {
        console.log("type -> ", type);
        setActiveTab(type);

        setTimeout(() => {
            setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
        }, 3000);
    };

    useEffect( ()=>{
        //do search
        // first time ->didMount ->searchOption:{type:all,keyword: ''}
        //after the first time ->didUpdate ->search option:{type: keyword/user/all,keyword:keyword}
        const{type,keyword}=searchOption;
        fetchPost(searchOption);
        },[searchOption]);

    const fetchPost = option =>{
        // fetch post from the server
        //step 1:api config
        //step2: send request
        //step 3: response
        // case1 : success
        // case2: failed
        const{type,keyword}=searchOption
        let url='';
        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        const opt= {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    setPosts(res.data)

                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };
    const renderPosts = (type) => {
        // case 1:no data -> return no data
        // case 2: type == image -> filter image posts
        // case 3: type == video -> filter video posts
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        if (type === "image") {
            const imageArr = posts
                .filter((item) => item.type === "image")
                .map(item =>{ //遍历
                    //object satisfy react-grid-gallery
                    return{
                        postId:item.id,
                        src: item.url,
                        user: item.user,
                        caption: item.message,
                        thumbnail: item.url,
                        thumbnailWidth: 300,
                        thumbnailHeight: 200
                    }
                })
            return<PhotoGallery images={imageArr} />
        } else if (type === "video") {
           //filter video
            return<Row gutter={32}>
                {
                    posts
                        .filter(item=>item.Type==='video')
                        .map(post =>{
                            return(<Col span={8}>
                                <video src={post.url}
                                       control={true} // video control like play, pause
                                       className="video-block"

                                />
                                <p>{`${post.user}:${post.message}`}</p>
                            </Col>)
                        })
                }
            </Row>
        }
    };

    const operations =<CreatePostButton onShowPost={showPost}/>;

    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch} />
            <div className="display">
                <Tabs defaultActiveKey="1"
                      onChange={(key) =>{
                          console.log(key)
                          setActiveTab(key)
                      }}
                      activeKey={activeTab}
                      tabBarExtraContent={operations}
                >
                    <TabPane tab="Image" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Video" key="video">
                        {renderPosts("video")}
                    </TabPane> //点击tab触发onchange return tab.key
                </Tabs>
            </div>
        </div>
    );
}

export default Home;