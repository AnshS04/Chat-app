import React from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import axios from "axios";
// import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    // const history = useHistory();
    const navigate = useNavigate()

    const handleClick = () => {
        setShow(!show);
    }

    const submitHandle = async () => {
        console.log("in submit handle");
        setLoading(true);
        if(!email || !password) {
            toast({
                title: 'Enter all the details',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            console.log("in try catch");

            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const {data} = await axios.post("/api/user/login", {email, password}, config);
            console.log("data", data);

            toast({
                title: 'Login successfull',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        }
        catch(error) {
            toast({
                title: 'Some error occured',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    return (
        <VStack spacing='5px'>

            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your name' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your password' value={password} type={show ? "text" : "password"} onChange={(e) => { setPassword(e.target.value) }} />
                    <InputRightElement width='4.5rem'>
                        <Button onClick={handleClick} height='35px'>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button colorScheme='blue' width='100%' style={{ marginTop: '15px' }} onClick={submitHandle} isLoading={loading} >Login</Button>
            <Button variant='solid' colorScheme='red' width='100%' style={{ marginTop: '15px' }} onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456")
            }}>Get guest user</Button>

        </VStack>
    )
}

export default Login