export const mockFunction = `from types import FunctionType
__stats__ = {}
def ____mockFunction(functionName):
    global globalVariables
    globalVariables = globals();
    functionToMock = globalVariables[functionName];
    if functionToMock == None:
        return
    elif(callable(functionToMock)):
        globals()[f"{functionName}____"] = globals()[functionName]
        f_code = compile(f"""def {functionName}____(self, *args, **kwargs):
    global __stats__
    try:
        if({functionName} in __stats__):
            __stats__['{functionName}']["call_count"]+=1
        else:
            __stats__['{functionName}'] = {"call_count":1}
    except:
        __stats__={{
            '{functionName}': {{"call_count":1}}
        }}

    return {functionName}____(self, *args, *
});*kwargs)""","<>", "exec")
        globals()[functionName]= FunctionType(f_code.co_consts[0], globals(), functionName)`;

export const serializeFnJava = `
public static int serializeInteger(String data){
  return Integer.parseInt(data);
}

public static String serializeString(String data){
  return data;
}
public static boolean serializeBoolean(String data){
  return Boolean.parseBoolean(data);
}
public static char serializeCharacter(String data){
  return data.charAt(0);
}

public static float serializeFloat(String data){
  return Float.parseFloat(data);
}
  `;

export const deserializeFnJava = `
  public static<T> String deSerialize(T data){
    return data.toString();
  }
`;

export const serializeFnCpp = `
using namespace std;

int serializeInteger(string data){
  return stoi(data);
}

string serializeString(string data){
  return data;
}


string toLower(string data)
{
    for (int i = 0; i < sizeof(data) / sizeof(data[0]); i++)
    {
        char c = data[i];
        data[i] = std::tolower(c);
    }
    return data;
}

bool serializeBoolean(string data)
{
    if (toLower(data) == "true")
    {
        return true;
    }
    else
    {
        return false;
    }
}

float serializeFloat(string data)
{
    // using to double as double has more precision but are basically same
    return stod(data);
}

char serializeCharacter(string character)
{
    return character[0];
}
  `;

export const deserializeFnCpp = `
string deSerializeCharacter(char character)
{
    string value = " ";
    value[0] = character;
    return value;
}

string deSerializeBoolean(bool data)
{
    if (data)
    {
        return "true";
    }
    else
    {
        return "false";
    }
}

string deSerializeInteger(int data)
{
    return std::to_string(data);
}

string deSerializeFloat(float data)
{
    return std::to_string(data);
}
`;

export const serializeFnC = `
 int serializeInteger(const char * data){
  return atoi(data);
}

export const char* serializeString(const char * data){
  return data;
}
 bool serializeBoolean(const char * data){
  return atol(data);
}
 char serializeCharacter(const char * data){
  return data[0];
}

 float serializeFloat(const char * data){
  return atof(data);
}
  `;

export const deserializeFnC = `
char ___buffer [33];
char * deSerializeInteger(int data){
  snprintf(___buffer, sizeof(___buffer), "%d", data);
  return ___buffer;
}
cexport onst char* deSerializeFloat(float data){
  // floats cannot be more than 20 digits for now and the accuracy of the floating data is not guaranteed
  snprintf(___buffer,sizeof(___buffer),"%f",data);
  return ___buffer;
}
cexport onst char* deSerializeString(const char* data){
  return data;
}
cexport onst char* deSerializeBoolean(bool data){
 return data? "true":"false";
}
char ___charBuffer[1]="";
const char* deSerializeChexport aracter(char data){
  ___charBuffer[0]=data;
  return ___charBuffer;
}
`;

export const serializeFnPython = `def serialize(data):
    return data`;

export const deserializeFnPython = `def deserialize(data):
    return data`;

export const preCodeForRawExecutionPython = `export 
import sys
_____ipts____ = []
_____cntr____ = 0
def input(prompt=""):
    global _____cntr____
    if _____cntr____ < len(_____ipts____):
        input= _____ipts____[_____cntr____]
        _____cntr____ = _____cntr____+1;
        return input
    else:
        input = ____ipts____[len(_____ipts____)%____cntr____]
        _____cntr____ = _____cntr____+1;
        return input



if len(sys.argv) > 1:
    for i in range(len(sys.argv)):
        # arg = serialize(sys.argv[i])
        arg = sys.argv[i]
        if i >= 1:
            _____ipts____.append(arg)`;

export const deserializeFnJs = `
function deserialize(data){
  return JSON.stringify(data).toString();
}
`;

export const serializeFnJs = `
function serialize(data){
  return JSON.parse(data);
}
`;
