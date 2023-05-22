import {request,response} from 'express';

const getUser = (req = request, res = response)=>{
    res.render('index',{
        title: 'Usuario '
    })
}

export {
    getUser
}