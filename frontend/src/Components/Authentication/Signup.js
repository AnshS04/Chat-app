import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useState } from 'react';
import {useHistory} from 'react-router-dom';

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const history = useHistory()

    const toast = useToast();

    const handleClick = () => {
        setShow(!show);
    }

    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }

        if(pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dwuvo1a4k");
            fetch("https://api.cloudinary.com/v1_1/dwuvo1a4k/image/upload", {
                method: "post",
                body: data,
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                setLoading(false);
                console.log(pic);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            })
        }
        else {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    const submitHandle = async () => {
        setLoading(true);
        if(!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        if(password !== confirmPassword) {
            toast({
                title: 'Confirm password does not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post("/api/user", {name, email, password, pic}, config)
            toast({
                title: 'Registration successfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push('/chats');
        } 
        catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px'>

            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your name' onChange={(e) => { setName(e.target.value) }} />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your email' onChange={(e) => { setEmail(e.target.value) }} />
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your password' type={show ? "text" : "password"} onChange={(e) => { setPassword(e.target.value) }} />
                    <InputRightElement width='4.5rem'>
                        <Button height='35px' onClick={handleClick} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Confirm password' type={show ? "text" : "password"} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                    <InputRightElement width='4.5rem'>
                        <Button height='35px' onClick={handleClick} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>Upload your picture</FormLabel>
                <Input type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>

            <Button colorScheme='blue' width='100%' style={{marginTop: '15px'}} onClick={submitHandle} isLoading={loading} >Sign Up</Button>

        </VStack>
    )
}

export default Signup