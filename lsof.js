const getpid = new NativeFunction(Module.findExportByName(null, 'getpid'), 'int', []);
const proc_pidinfo = new NativeFunction(Module.findExportByName(null, 'proc_pidinfo'), 'int', ['int', 'int', 'uint64', 'pointer', 'int']); 
const proc_pidfdinfo = new NativeFunction(Module.findExportByName(null, 'proc_pidfdinfo'), 'int', ['int', 'int', 'int', 'pointer', 'int'])


function main() {
    var pid = getpid();
    var buff_size = proc_pidinfo(pid, 1, 0, new NativePointer(0), 0);
    var procFDInfo = Memory.alloc(buff_size); 
    
    buff_size = proc_pidinfo(pid, 1, 0, procFDInfo, buff_size); 

    var num_fds = buff_size /  8; // sizeof(proc_fdinfo = 64bit = 8 bytes)

    for(var i=0; i< num_fds; i++){
        var offset = i*8;
        var proc_fd = Memory.readS32(procFDInfo.add(offset)); 
        var proc_fdtype = Memory.readU32(procFDInfo.add(offset+4)); 
       
        var buff = Memory.alloc(1200);
        var sz = proc_pidfdinfo(pid, proc_fd, 2, buff, 1200); 
        var path = Memory.readCString(buff.add(16*11))
        if (path.length > 0) {
            console.log("path", path)
        }

    }
}

main();
