import hashlib

def hash_ip(ip_address):
    # Ensure the IP is in a consistent format (e.g., case for IPv6)
    normalized_ip = ip_address.lower() 
    hashed_ip = hashlib.sha256(normalized_ip.encode()).hexdigest()
    return hashed_ip
