function saveItem(key, value)
{
	if(isSupported())
	{
		localStorage.setItem(key, value);
	}

}
function getItem(key)
{

	return localStorage.getItem(key);
}
function isSupported()
{
	if(localStorage)
	{
		return true;
	}
	else
	{
		return false;
	}
}