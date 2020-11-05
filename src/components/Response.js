const Response = (props)=>{
    if(props){
        return (
        <div>{props.response}</div>

        );
    }else{
        return <div>No Data</div>;
    }
};
export default Response;