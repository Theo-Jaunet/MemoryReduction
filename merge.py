import base64
from io import BytesIO

from PIL import Image
import numpy as np
import os
import ujson


def loop(dir, file, nb, out):
    temp = []
    for i in range(nb):
        temp.append('data/' + dir + '/images/' + file + 'input' + str(i) + '.jpg')

    print(temp[0])
    imar = [Image.open(i) for i in temp]

    min_shape = sorted([(np.sum(i.size), i.size) for i in imar])[0][1]
    imgs_comb = np.hstack((np.asarray(i.resize(min_shape)) for i in imar))

    imgs_comb = Image.fromarray(imgs_comb)
    imgs_comb.save(out + '.jpg')


def loop_from_DIY(dir):
    reds = getfile(dir)
    u = 0
    nb = len(reds)

    print(nb)
    for file in reds:

        print('doing #', u, '/', nb, ' ..', end='')

        with open(file, 'r') as t:
            tfile = ujson.load(t)

            for i in range(len(tfile['hiddens'])):
                for w in range(len(tfile['hiddens'][i])):
                    tfile['hiddens'][i][w] = round(float(tfile['hiddens'][i][w]), 1)

            for i in range(len(tfile['probabilities'])):
                for w in range(len(tfile['probabilities'][i])):
                    tfile['probabilities'][i][w] = round(float(tfile['probabilities'][i][w]), 1)

            for i in range(len(tfile['orientations'])):
                tfile['orientations'][i] = round(float(tfile['orientations'][i]), 0)

            imgs = []

            for i in range(len(tfile['inputs'])):
                im = Image.open(BytesIO(base64.b64decode(tfile['inputs'][i])))

                width = int(320 * 0.75)
                height = int(180 * 0.75)

                size = width, height

                im = im.resize(size, Image.ANTIALIAS)
                imgs.append(im)

            min_shape = sorted([(np.sum(i.size), i.size) for i in imgs])[0][1]
            imgs_comb = np.hstack((np.asarray(i.resize(min_shape)) for i in imgs))

            imgs_comb = Image.fromarray(imgs_comb)
            imgs_comb.save('data/diy/images/' + file.split('/')[len(file.split('/')) - 1].replace('.json', '.jpg'))

            del tfile['inputs']

            with open('data/diy/images' + '/' + file.split('/')[len(file.split('/')) - 1], 'w') as ff:
                ujson.dump(tfile, ff)

        print('done')
        u += 1


def change(dir, filename, type):
    with open(dir + '/' + filename + '.' + type, 'r') as t:
        tfile = ujson.load(t)

        for i in range(len(tfile['hiddens'])):
            for w in range(len(tfile['hiddens'][i])):
                tfile['hiddens'][i][w] = round(float(tfile['hiddens'][i][w]), 1)

        for i in range(len(tfile['probabilities'])):
            for w in range(len(tfile['probabilities'][i])):
                tfile['probabilities'][i][w] = round(float(tfile['probabilities'][i][w]), 1)

        for i in range(len(tfile['orientations'])):
            tfile['orientations'][i] = round(float(tfile['orientations'][i]), 0)

    for i in range(len(tfile['inputs'])):
        im = Image.open(BytesIO(base64.b64decode(tfile['inputs'][i])))

        width = int(320 * 0.75)
        height = int(180 * 0.75)

        size = width, height

        im = im.resize(size, Image.ANTIALIAS)

        im.save(dir + "/images/" + filename + "_input" + str(i) + ".jpg", optimize=True, quality=65)

    del tfile['inputs']

    with open(dir + '/' + filename + '.' + type, 'w') as ff:
        ujson.dump(tfile, ff)


def dev():
    dirs = ['diy', 'main', 'random', 'sel', 'top']
    j = 0
    with open('pos.json', 'w') as file:
        file.write('{')
        z = 0
        for dir in dirs:
            li = getfile('data/' + dir)
            print(li)

            for i in range(len(li)):

                with open(li[i], 'r') as outfile:
                    fi = ujson.load(outfile)

                    for u in range(len(fi['positions'])):
                        for w in range(len(fi['positions'][u])):
                            fi['positions'][u][w] = round(float(fi['positions'][u][w]), 1)

                    file.write("\"traj" + str(j) + "\": {")
                    file.write("\"traj_id\":" + "\"" + dir + "\",")
                    file.write("\"pos\":")
                    file.write(ujson.dumps(fi["positions"]))
                    file.write("}")
                    j += 1
                if z < len(dirs) - 1:
                    file.write(',')
                elif i < len(li) - 1:
                    file.write(',')
            z += 1
        file.write("}")
    return 'ok'


def getfile(path):
    files = []
    file = [".json"]
    for f in os.listdir(path):
        ext = os.path.splitext(f)[1]
        if ext.lower() not in file:
            continue
        files.append(os.path.join(path, f))

    return files


if __name__ == '__main__':
    # loop_from_DIY('data/nDIY')
    dev()
