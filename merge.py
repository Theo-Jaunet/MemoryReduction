from PIL import Image
import numpy as np


def loop(dir, file, nb, out):
    temp = []
    for i in range(nb):
        temp.append('data/'+dir + '/images/' + file + 'input' + str(i) + '.jpg')

    print(temp[0])
    imar = [Image.open(i) for i in temp]

    min_shape = sorted([(np.sum(i.size), i.size) for i in imar])[0][1]
    imgs_comb = np.hstack((np.asarray(i.resize(min_shape)) for i in imar))

    imgs_comb = Image.fromarray(imgs_comb)
    imgs_comb.save(out + '.jpg')


if __name__ == '__main__':
    loop('top', 'quatch_', 67, 'top3')
