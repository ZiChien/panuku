const roomlist =[]

function authPinCode(PinCode) {
    const result = roomlist.filter((item) => {
        return item.pinCode == PinCode
    })
    return !result.length
}
function addUserToRooom(pinCode, nickname) {
    const index = roomlist.findIndex(room => room.pinCode == pinCode)
    roomlist[index].member.push(nickname)
    return index
}
function findRoom(pinCode){
    const index = roomlist.findIndex(room => room.pinCode == pinCode)
    if(index!=-1){
        return roomlist[index]
    }else{
        return false
    }
}
function getRoomIndex(pinCode){
    const index = roomlist.findIndex(room => room.pinCode == pinCode)
    return index
}
function distroyRoom(pinCode){
    const room = findRoom(pinCode)
    if(room){
        if(room.member.length <= 0){
            console.log(`Distroy room pincode: ${pinCode}`);
            roomlist.splice(getRoomIndex(pinCode),1)
            console.log(`Rooms count:${roomlist.length}`);
        }
    }
    return
}
module.exports = {
    roomlist, authPinCode,findRoom,addUserToRooom,getRoomIndex,distroyRoom
}
