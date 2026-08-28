import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Network from 'expo-network';
import { sendPing } from '@/server/socket';

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const scanNetwork = async () => {
    const ipAddress = await Network.getIpAddressAsync();
    const baseIp = ipAddress.substring(0, ipAddress.lastIndexOf('.'));
    
    console.log(`Scanning network ${baseIp}.x ...`);

    const promises = [];
    for(let i = 1; i <= 254; i++)
    {
      const targetIp = `${baseIp}.${i}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      promises.push(
        sendPing(targetIp, controller.signal)
          .then(res => res.json())
          .then(data => {
            if(data)
              return {
                ip: targetIp,
                serverData: data
              };
            return null;
          })
          .catch(() => null)
      );
    }

    const results = await Promise.all(promises);
    const foundServers = results.filter(server => server !== null);

    return foundServers;
  }