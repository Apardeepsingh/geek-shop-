import React, { useEffect } from 'react';


const NotFound = () => {

    useEffect(() => {
        document.title = "404 not found";
      }, []);

    return(
        <>
            <h1>not found</h1>
        </>
    )
}


export default NotFound