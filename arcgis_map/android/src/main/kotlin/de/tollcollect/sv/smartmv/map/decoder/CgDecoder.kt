package de.tollcollect.sv.smartmv.map.decoder

import de.tollcollect.sv.smartmv.map.model.Coordinate

class CgDecoder {

    companion object {
        fun decode(cgString: String): List<Coordinate> {

            val coordinates = mutableListOf<Coordinate>()

            val nIndexXY = mutableListOf(0)

            val firstElement = extractInt(cgString, nIndexXY)

            val dMultByXY = if (firstElement == 0) {
                val version = extractInt(cgString, nIndexXY)

                if (version != 1) {
                    throw Exception("Compressed geometry: Unexpected version.")
                }

                extractInt(cgString, nIndexXY)
            } else {
                firstElement
            }

            var nLastDiffX = 0.0
            var nLastDiffY = 0.0

            while ((nIndexXY[0] < cgString.length)) {
                val nDiffX = extractInt(cgString, nIndexXY)
                val nX = nDiffX + nLastDiffX
                nLastDiffX = nX
                val dX = nX / dMultByXY
                val nDiffY = extractInt(cgString, nIndexXY)
                val nY = nDiffY + nLastDiffY
                nLastDiffY = nY

                val dY = nY / dMultByXY

                coordinates.add(Coordinate(long = dX, lat = dY))
            }

            return coordinates
        }


        private fun extractInt(cgString: String, index: MutableList<Int>): Int {
            var i = index[0] + 1

            while ((i < cgString.length &&
                        cgString.elementAt(i) != '-' &&
                        cgString.elementAt(i) != '+' &&
                        cgString.elementAt(i) != '|')
            ) {
                i++
            }
            val sr32 = cgString.substring(index[0], i)

            index[0] = i

            return sr32.replace("+", "").toInt(radix = 32)
        }
    }
}